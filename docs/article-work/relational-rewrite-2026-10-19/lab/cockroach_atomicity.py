#!/usr/bin/env python3
"""Native two-range fault histories. Singleton replicas isolate availability.

The protocol shim can discard an actual COMMIT completion before exposing it
to its caller. This does not observe Cockroach's internal commit record stage.
"""
import argparse
import csv
import io
import json
import socket
import ssl
import struct
import time
from cockroach_lab import Lab, WORK, bootstrap

class AtomicLab(Lab):
    def save(self):
        (WORK/'evidence/cockroach-atomicity-observed.json').write_text(json.dumps({
            'scope':'CockroachDB25.4.17, native TLS processes on one macOS ARM64 host. Two distinct table ranges deliberately use singleton replicas at different nodes. This isolates an unavailable participant and is not a resilient deployment configuration or internal protocol trace.',
            'records':self.records},indent=2)+'\n')

class Wire:
    def __init__(self,lab,node=1):
        self.lab=lab
        raw=socket.create_connection(('127.0.0.1',56900+node),timeout=20)
        raw.sendall(struct.pack('!II',8,80877103))
        if raw.recv(1)!=b'S':raise RuntimeError('TLS not accepted')
        context=ssl.create_default_context(cafile=lab.certs/'ca.crt')
        context.load_cert_chain(lab.certs/'client.root.crt',lab.certs/'client.root.key')
        self.socket=context.wrap_socket(raw,server_hostname='localhost')
        body=struct.pack('!I',196608)+b'user\0root\0database\0workshop\0application_name\0atomicity-worksheet\0\0'
        self.socket.sendall(struct.pack('!I',len(body)+4)+body)
        self.receive()
    def exact(self,n):
        data=b''
        while len(data)<n:
            part=self.socket.recv(n-len(data))
            if not part:raise EOFError('Connection ended')
            data+=part
        return data
    def receive(self,drop=None):
        rows=[];tags=[];errors=[]
        while True:
            kind=self.exact(1);length=struct.unpack('!I',self.exact(4))[0]
            body=self.exact(length-4)
            if kind==b'D':
                count=struct.unpack('!H',body[:2])[0];offset=2;row=[]
                for _ in range(count):
                    size=struct.unpack('!i',body[offset:offset+4])[0];offset+=4
                    row.append(None if size<0 else body[offset:offset+size].decode())
                    if size>=0:offset+=size
                rows.append(row)
            if kind==b'E':errors.append(body.replace(b'\0',b'|').decode())
            if kind==b'C':
                tags.append(body.rstrip(b'\0').decode())
                if drop and body==b'COMMIT\0':
                    drop()
                    self.socket.close()
                    return {'rows':rows,'tags':tags,'errors':errors,'application_reply':'discarded; caller sees uncertain outcome'}
            if kind==b'Z':return {'rows':rows,'tags':tags,'errors':errors}
    def q(self,label,statement,drop=None):
        body=statement.encode()+b'\0'
        self.socket.sendall(b'Q'+struct.pack('!I',len(body)+4)+body)
        result=self.receive(drop)
        self.lab.records.append({'label':label,'sql':statement,**result});self.lab.save()
        print(label,result,flush=True)
        return result
    def close(self):self.socket.close()

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--bin',required=True)
    args=parser.parse_args();lab=AtomicLab(args.bin)
    try:
        bootstrap(lab)
        lab.sql('RL124-two-range-fixture',"CREATE TABLE workshop.tx_left(k STRING PRIMARY KEY,n INT); CREATE TABLE workshop.tx_right(k STRING PRIMARY KEY,n INT); INSERT INTO workshop.tx_left VALUES('effect',0),('health',0); INSERT INTO workshop.tx_right VALUES('effect',0); ALTER TABLE workshop.tx_left CONFIGURE ZONE USING num_replicas=1,constraints='[+zone=us2]'; ALTER TABLE workshop.tx_right CONFIGURE ZONE USING num_replicas=1,constraints='[+zone=ap3]'; ALTER TABLE workshop.tx_left SPLIT AT VALUES('effect'); ALTER TABLE workshop.tx_right SPLIT AT VALUES('effect')")
        for _ in range(120):
            observations=[]
            for table,locality in [('tx_left','zone=us2'),('tx_right','zone=ap3')]:
                result=lab.sql('RL124-range-placement-'+table,f'SHOW RANGES FROM TABLE workshop.{table} WITH DETAILS')
                rows=list(csv.DictReader(io.StringIO(result.stdout)))
                observations.append(bool(rows) and all(locality in row['lease_holder_locality'] and len(row['voting_replicas'].strip('{}').split(','))==1 for row in rows))
            if all(observations):break
            time.sleep(1)
        else:raise RuntimeError('Distinct singleton ranges did not converge')
        client=Wire(lab)
        client.q('RL124-cross-range-begin','BEGIN')
        client.q('RL124-cross-range-left',"UPDATE tx_left SET n=1 WHERE k='effect'")
        client.q('RL124-cross-range-right',"UPDATE tx_right SET n=1 WHERE k='effect'")
        reply=client.q('RL124-discard-commit-and-lose-gateway','COMMIT',drop=lambda:lab.stop(1,abrupt=True))
        if reply.get('application_reply') is None:raise AssertionError('No COMMIT completion discarded')
        state=lab.sql('RL124-after-gateway-loss',"SELECT l.n AS left_value,r.n AS right_value FROM workshop.tx_left l CROSS JOIN workshop.tx_right r WHERE l.k='effect' AND r.k='effect'",node=2)
        if state.stdout.strip().splitlines()[-1]!='1,1':raise AssertionError(state.stdout)
        lab.start(1);lab.wait(1)
        client=Wire(lab)
        client.q('RL124-unavailable-participant-timeout',"SET statement_timeout='2s'")
        client.q('RL124-unavailable-participant-begin','BEGIN')
        client.q('RL124-provisional-left',"UPDATE tx_left SET n=2 WHERE k='effect'")
        lab.stop(3,abrupt=True)
        lab.sql('RL124-healthy-participant-answers',"SELECT n FROM workshop.tx_left WHERE k='health'",node=2)
        blocked=client.q('RL124-required-right-unavailable',"UPDATE tx_right SET n=2 WHERE k='effect'")
        if not blocked['errors']:raise AssertionError('Unavailable participant unexpectedly answered')
        client.q('RL124-abandon-incomplete-unit','ROLLBACK');client.close()
        lab.start(3);lab.wait(3)
        final=lab.sql('RL124-no-partial-visible-unit',"SELECT l.n AS left_value,r.n AS right_value FROM workshop.tx_left l CROSS JOIN workshop.tx_right r WHERE l.k='effect' AND r.k='effect'",node=2)
        if final.stdout.strip().splitlines()[-1]!='1,1':raise AssertionError(final.stdout)
    finally:lab.cleanup()

if __name__=='__main__':main()
