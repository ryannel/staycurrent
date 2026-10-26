import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
const binary=process.env.REDIS_SERVER||'redis-server';
const version=execFileSync(binary,['--version'],{encoding:'utf8'});
assert.match(version,/v=8\.2\.2\b/,'This lab is pinned to Redis 8.2.2; set REDIS_SERVER to that binary');
// /tmp is short enough for Unix socket path limits on macOS as well as Linux.
const directory=await mkdtemp(path.join(process.platform==='darwin'?'/tmp':tmpdir(),'sc-memory-'));
const socket=path.join(directory,'redis.sock');
const server=spawn(binary,['--port','0','--unixsocket',socket,'--unixsocketperm','700','--save','','--appendonly','no','--dir',directory],{stdio:['ignore','pipe','pipe']});
let serverOutput='',child;
server.stdout.on('data',data=>serverOutput+=data);server.stderr.on('data',data=>serverOutput+=data);
const closed=new Promise(resolve=>server.once('close',resolve));
try{
 for(let i=0;i<100;i++){if(server.exitCode!==null)throw new Error(serverOutput);if(await stat(socket).catch(()=>null))break;await delay(25);}
 assert.ok(await stat(socket).catch(()=>null),'Private Redis socket did not appear');
 child=spawn(process.execPath,['client.mjs'],{cwd:path.dirname(fileURLToPath(import.meta.url)),env:{...process.env,REDIS_SOCKET:socket},stdio:'inherit'});
 const result=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{child.kill();reject(new Error('Lab exceeded 30 seconds'));},30000);child.once('error',e=>{clearTimeout(timer);reject(e);});child.once('exit',code=>{clearTimeout(timer);resolve(code);});});
 assert.equal(result,0,'Client assertions failed');
}finally{
 if(child&&child.exitCode===null)child.kill();
 server.kill('SIGTERM');await closed;await rm(directory,{recursive:true,force:true});
}
