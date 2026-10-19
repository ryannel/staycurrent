#!/usr/bin/env python3
"""A distinct destination cluster and a real application-identity repair."""
import argparse
import json
import subprocess
import time
from cockroach_lab import Lab, WORK, bootstrap

class RestoreLab(Lab):
    def save(self):
        (WORK/'evidence/cockroach-restore-observed.json').write_text(json.dumps({
            'scope': 'Independent source/destination cluster stores on one macOS ARM64 host; shared temporary external-file directory and lab CA. Not independent-host disaster recovery.',
            'binary': self.binary, 'records': self.records}, indent=2)+'\n')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--bin',required=True)
    args=parser.parse_args()
    lab=RestoreLab(args.bin)
    try:
        bootstrap(lab)
        lab.sql('RL129-source-app', 'CREATE USER booking_app; GRANT CONNECT ON DATABASE workshop TO booking_app; GRANT USAGE ON SCHEMA workshop.public TO booking_app; GRANT SELECT ON workshop.sessions,workshop.orders TO booking_app')
        lab.command('RL129-app-certificate',[lab.binary,'cert','create-client','booking_app',f'--certs-dir={lab.certs}',f'--ca-key={lab.directory}/ca.key'])
        lab.sql('RL129-independent-backup', "BACKUP DATABASE workshop INTO 'nodelocal://1/independent-backup' WITH revision_history", timeout=180)
        command=[lab.binary,'start-single-node',f'--certs-dir={lab.certs}',
                 f'--store={lab.directory}/destination','--listen-addr=127.0.0.1:57001',
                 '--advertise-addr=localhost:57001','--http-addr=127.0.0.1:58001',
                 f'--external-io-dir={lab.directory}/external','--cache=64MiB',
                 '--max-sql-memory=256MiB',f'--log-dir={lab.directory}/destination-logs']
        with open(lab.directory/'node101.console','w') as output:
            lab.processes[101]=subprocess.Popen(command,stdout=output,stderr=output,env=lab.env)
        lab.records.append({'label':'RL129-independent-cluster-start','command':command})
        lab.save();lab.wait(101)
        started=time.monotonic()
        lab.sql('RL129-independent-restore',"RESTORE DATABASE workshop FROM LATEST IN 'nodelocal://1/independent-backup' WITH new_db_name='restored'",node=101,timeout=180)
        lab.records.append({'label':'RL129-observed-restore-seconds','seconds':time.monotonic()-started})
        lab.save()
        lab.sql('RL129-independent-record-acceptance','SELECT * FROM restored.orders; SELECT * FROM restored.sessions; SHOW GRANTS ON restored.sessions',node=101)
        lab.sql('RL129-missing-destination-identity','SELECT * FROM restored.orders',node=101,user='booking_app',check=False)
        lab.sql('RL129-create-destination-identity','CREATE USER booking_app; GRANT CONNECT ON DATABASE restored TO booking_app; GRANT USAGE ON SCHEMA restored.public TO booking_app',node=101)
        lab.sql('RL129-existing-identity-missing-grant','SELECT * FROM restored.orders',node=101,user='booking_app',database='restored',check=False)
        lab.sql('RL129-repair-runtime-grants','GRANT SELECT ON restored.orders,restored.sessions TO booking_app',node=101)
        lab.sql('RL129-runtime-allowed','SELECT request,amount FROM orders; SELECT * FROM sessions',node=101,user='booking_app',database='restored')
        lab.sql('RL129-runtime-mutation-denied','UPDATE sessions SET remaining=99',node=101,user='booking_app',database='restored',check=False)
        lab.sql('RL129-restored-invariant-rejects-invalid','UPDATE restored.sessions SET remaining=-1',node=101,check=False)
        target=lab.sql('RL129-valid-before-acceptance','SELECT cluster_logical_timestamp()').stdout.strip().splitlines()[-1]
        accepted=lab.sql('RL129-valid-later-reservation', "WITH admitted AS (UPDATE workshop.sessions SET remaining=remaining-1 WHERE tenant='t4' AND session='s7' AND remaining>0 RETURNING tenant) INSERT INTO workshop.orders SELECT tenant,'r82',42,22.00 FROM admitted RETURNING request")
        if 'r82' not in accepted.stdout:raise AssertionError('No valid later reservation')
        lab.sql('RL129-valid-incremental',"BACKUP DATABASE workshop INTO LATEST IN 'nodelocal://1/independent-backup' WITH revision_history",timeout=180)
        lab.sql('RL129-valid-mistake',"DELETE FROM workshop.orders WHERE request='r82'; SELECT * FROM workshop.sessions")
        lab.sql('RL129-valid-latest-restore',"RESTORE DATABASE workshop FROM LATEST IN 'nodelocal://1/independent-backup' WITH new_db_name='valid_latest'",node=101,timeout=180)
        lab.sql('RL129-valid-latest-state','SELECT request,amount FROM valid_latest.orders ORDER BY request; SELECT * FROM valid_latest.sessions',node=101)
        lab.sql('RL129-valid-earlier-restore',f"RESTORE DATABASE workshop FROM LATEST IN 'nodelocal://1/independent-backup' AS OF SYSTEM TIME '{target}' WITH new_db_name='valid_earlier'",node=101,timeout=180)
        lab.sql('RL129-valid-earlier-state','SELECT request,amount FROM valid_earlier.orders ORDER BY request; SELECT * FROM valid_earlier.sessions',node=101)
        from cockroach_extra import Client
        client=Client(lab,'RL129-coupled-reconciliation',node=101,database='valid_earlier')
        try:
            for attempt in range(2):
                claimed=client.send("BEGIN; INSERT INTO orders VALUES('t4','r82',42,22.00) ON CONFLICT(tenant,request) DO NOTHING RETURNING request;")
                if claimed.strip()=='r82':
                    remaining=client.send("UPDATE sessions SET remaining=remaining-1 WHERE tenant='t4' AND session='s7' AND remaining>0 RETURNING remaining;")
                    if remaining.strip()!='1':
                        client.send('ROLLBACK;')
                        raise AssertionError('Reconciliation did not reserve expected capacity')
                else:
                    intent=client.send("SELECT customer,amount FROM orders WHERE tenant='t4' AND request='r82';")
                    if intent.strip()!='42|22.00':
                        client.send('ROLLBACK;')
                        raise AssertionError('Existing identity has different intent')
                client.send('COMMIT;')
                client.send('SELECT request,amount FROM orders ORDER BY request; SELECT remaining FROM sessions;')
        finally:
            client.close()
    finally:
        lab.cleanup()

if __name__=='__main__':main()
