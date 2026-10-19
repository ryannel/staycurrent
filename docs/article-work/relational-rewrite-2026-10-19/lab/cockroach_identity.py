#!/usr/bin/env python3
"""Failed secure join, trust repair and bounded client-identity replacement."""
import argparse
import csv
import hashlib
import io
import json
import shutil
import subprocess
import time
from cockroach_lab import Lab, WORK, bootstrap

class IdentityLab(Lab):
    def save(self):
        (WORK/'evidence/cockroach-identity-observed.json').write_text(json.dumps({
            'scope':'Native CockroachDB25.4.17, disposable TLS cluster on one macOS ARM64 host. Wrong CA belongs only to a new disposable node. Client revocation probes new connections; existing pooled sessions need separate termination.',
            'records':self.records},indent=2)+'\n')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--bin',required=True)
    args=parser.parse_args();lab=IdentityLab(args.bin)
    try:
        bootstrap(lab)
        wrong=lab.directory/'wrong-certs';wrong.mkdir()
        common=[f'--certs-dir={wrong}',f'--ca-key={lab.directory}/wrong-ca.key']
        lab.command('RL128-wrong-ca',[lab.binary,'cert','create-ca',*common])
        lab.command('RL128-wrong-node',[lab.binary,'cert','create-node','localhost','127.0.0.1',*common])
        command=[lab.binary,'start',f'--certs-dir={wrong}',f'--store={lab.directory}/node4',
                 '--listen-addr=127.0.0.1:56904','--advertise-addr=localhost:56904',
                 '--http-addr=127.0.0.1:57904','--join=localhost:56901',
                 '--locality=region=eu,zone=eu4','--cache=64MiB','--max-sql-memory=256MiB',
                 f'--log-dir={lab.directory}/wrong-logs']
        with open(lab.directory/'wrong-node.console','w') as output:
            lab.processes[4]=subprocess.Popen(command,stdout=output,stderr=output,env=lab.env)
        lab.records.append({'label':'RL128-start-untrusted-node','command':command});lab.save()
        time.sleep(6)
        logs=[*list((lab.directory/'wrong-logs').glob('*.log'))]
        text='\n'.join(p.read_text(errors='replace')[-12000:] for p in logs if not p.is_symlink())
        lab.records.append({'label':'RL128-untrusted-join-log','excerpt':text[-18000:]});lab.save()
        if 'unknown authority' not in text:raise AssertionError('Expected trust failure was not observed')
        lab.command('RL128-members-during-failed-join',[lab.binary,'node','status',f'--certs-dir={lab.certs}','--host=localhost:56901','--format=csv'])
        lab.sql('RL128-existing-foreground-during-failed-join','SELECT * FROM workshop.sessions')
        lab.stop(4,abrupt=True)
        lab.start(4);lab.wait(4)
        for _ in range(60):
            status=lab.command('RL128-repaired-join-members',[lab.binary,'node','status',f'--certs-dir={lab.certs}','--host=localhost:56901','--format=csv'])
            if len(list(csv.DictReader(io.StringIO(status.stdout))))==4:break
            time.sleep(1)
        else:raise AssertionError('Corrected node did not join')
        lab.sql('RL128-foreground-after-trust-repair','SELECT * FROM workshop.sessions',node=4)
        lab.sql('RL128-create-read-identity','CREATE USER booking_app; GRANT CONNECT ON DATABASE workshop TO booking_app; GRANT USAGE ON SCHEMA workshop.public TO booking_app; GRANT SELECT ON workshop.sessions TO booking_app')
        cert_args=[f'--certs-dir={lab.certs}',f'--ca-key={lab.directory}/ca.key']
        lab.command('RL128-initial-client-certificate',[lab.binary,'cert','create-client','booking_app','--lifetime=1h',*cert_args])
        old=lab.directory/'old-client';old.mkdir()
        for name in ['ca.crt','client.booking_app.crt','client.booking_app.key']:shutil.copy2(lab.certs/name,old/name)
        old_hash=hashlib.sha256((lab.certs/'client.booking_app.crt').read_bytes()).hexdigest()
        lab.sql('RL128-initial-client-read','SELECT * FROM sessions',user='booking_app',database='workshop')
        lab.command('RL128-replace-client-certificate',[lab.binary,'cert','create-client','booking_app','--lifetime=2h','--overwrite',*cert_args])
        new_hash=hashlib.sha256((lab.certs/'client.booking_app.crt').read_bytes()).hexdigest()
        lab.records.append({'label':'RL128-public-certificate-changed','old_sha256':old_hash,'new_sha256':new_hash});lab.save()
        if old_hash==new_hash:raise AssertionError('Client certificate did not change')
        lab.sql('RL128-replacement-client-read','SELECT * FROM sessions',user='booking_app',database='workshop')
        old_command=[lab.binary,'sql',f'--certs-dir={old}','--host=localhost:56901','--user=booking_app','--database=workshop','--format=csv','--execute=SELECT * FROM sessions']
        lab.command('RL128-old-certificate-still-valid',old_command)
        lab.sql('RL128-disable-former-identity','ALTER USER booking_app WITH NOLOGIN')
        lab.command('RL128-disabled-old-certificate',old_command,check=False)
        lab.sql('RL128-disabled-new-certificate','SELECT * FROM sessions',user='booking_app',database='workshop',check=False)
        lab.sql('RL128-replacement-identity','CREATE USER booking_app_v2; GRANT CONNECT ON DATABASE workshop TO booking_app_v2; GRANT USAGE ON SCHEMA workshop.public TO booking_app_v2; GRANT SELECT ON workshop.sessions TO booking_app_v2')
        lab.command('RL128-new-identity-certificate',[lab.binary,'cert','create-client','booking_app_v2',*cert_args])
        lab.sql('RL128-new-identity-allowed','SELECT * FROM sessions',user='booking_app_v2',database='workshop')
        lab.sql('RL128-new-identity-mutation-denied','UPDATE sessions SET remaining=99',user='booking_app_v2',database='workshop',check=False)
    finally:lab.cleanup()

if __name__=='__main__':main()
