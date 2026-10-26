// Six independent commands, negligible request/reply byte sizes, one server
// execution lane, symmetric propagation. Batch waits for its last reply.
export function pipelineSchedule({count=6,batch=1,rtt=20,service=2}={}) {
 const commands=[];let base=0;
 for(let offset=0;offset<count;offset+=batch){const size=Math.min(batch,count-offset);
  for(let j=0;j<size;j++){const execute=base+rtt/2+j*service;commands.push({id:offset+j+1,sent:base,arrive:base+rtt/2,execute,done:execute+service,reply:execute+service+rtt/2});}
  base=commands.at(-1).reply;
 }
 return {commands,end:base,serialEnd:count*(rtt+service),serverWork:count*service};
}
export function pipelineState(command,time){return time<command.sent?'not sent':time<command.arrive?'outbound':time<command.execute?'server queue':time<command.done?'executing':time<command.reply?'reply in flight':'complete';}

// Two commands share one serial execution lane. Separate streams remove only
// stream-order dependency. Each stream has its own idealised transmission budget.
export function responseQueue({large=100,expensive=false,separate=false}={}) {
 const service=[expensive?large:1,1],bytes=[expensive?1:large,1],commands=[];
 let server=5,previousSend=0;
 for(let i=0;i<2;i++){
  const execute=server;server+=service[i];
  const send=Math.max(server,separate?0:previousSend);const sent=send+bytes[i];previousSend=sent;
  commands.push({id:i+1,execute,done:server,send,sent,reply:sent+5,bytes:bytes[i],wait:send-server});
 }
 return {commands,end:Math.max(...commands.map(c=>c.reply)),small:commands[1].reply};
}

// Explicit lifecycle, not a running client implementation. Queue timer models
// the inspected node-redis6.3.0 implementation; application deadline is separate.
export function clientInitial(){return {stage:'unsent',timer:true,app:'waiting',server:'unchanged',message:'The command is in the client queue. Nothing has been written to the connection.'};}
export function clientStep(s,action){const n={...s};
 if(action==='send'&&s.stage==='unsent'){n.stage='sent';n.timer=false;n.message='The client hands the command to its connection and removes its queue timer. A Redis reply is still pending.';}
 if(action==='queue-timeout'&&s.stage==='unsent'){n.stage='removed';n.timer=false;n.app=s.app==='waiting'?'queue timeout':'late queue timeout';n.message='The unsent command is removed and its promise rejects. This attempt will not be sent.';}
 if(action==='execute'&&s.stage==='sent'){n.stage='executed';n.server='value written';n.message='Redis executes SET. The application has not received its reply, so it cannot yet confirm this from the command result.';}
 if(action==='deadline'&&['unsent','sent','executed'].includes(s.stage)&&s.app==='waiting'){n.app='deadline elapsed';n.message='The application stops waiting. This model does not cancel or remove the command. Its underlying operation may continue.';}
 if(action==='reply'&&s.stage==='executed'){n.stage='replied';n.app=s.app==='waiting'?'success':'late success';n.message='The OK reply arrives. If the request deadline already elapsed, this is a late command success, not an on-time user response.';}
 if(action==='disconnect'&&['sent','executed'].includes(s.stage)){n.stage='uncertain';n.app=s.app==='waiting'?'connection error':'late connection error';n.message='No reply was obtained. From this result alone the application cannot distinguish execution from non-execution. The displayed server state is extra observer knowledge.';}
 return n;
}
