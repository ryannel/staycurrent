import { text,path,travel,line,svg,app,database,ring,ball,phase,ease,makeScene } from '../drawing.mjs';
import { actions,colours,labelLines,recovery } from './core.mjs';
function buffers(t,small){
 const W=small?440:760,A=[65,205],B=[W*.56,115],D=[W-70,335],loaded=t>.4;let s=path(A,B)+path(B,D)+app(...A,'Query')+ring(...B,'Buffer',loaded?'Page A':'Empty','--teal',46)+database(...D,'Page file');
 s+=travel(t,.04,.14,A,B,'--blue')+travel(t,.15,.25,B,D,'--blue')+travel(t,.26,.4,D,B,'--blue');
 if(loaded)[0,1,2].forEach(i=>s+=ball(B[0]-22+i*22,B[1],colours[i]));
 s+=travel(t,.44,.55,B,A,'--blue')+travel(t,.64,.76,A,B,'--gold')+travel(t,.79,.9,B,A,'--gold');
 s+=labelLines(W/2,470,t<.6?['One page arrives for the mug.']:['The tea is on that page too.','The next query uses the buffer.']);return svg(s,small,545);
}
function versions(t,small,v){
 const W=small?440:760,old=[W*.24,215],fresh=[W*.76,215],A=[W*.24,65],B=[W*.76,65],written=t>.32;
 let s=app(...A,'Earlier reader')+app(...B,'Later reader')+ring(...old,v==='innodb'?'Undo':'Old version','£20','--blue')+ring(...fresh,v==='innodb'?'Current row':'New version',written?'£22':'','--gold');
 s+=path(old,A)+path(fresh,B)+travel(t,.1,.3,old,fresh,'--gold')+travel(t,.45,.65,old,A,'--blue')+travel(t,.49,.69,fresh,B,'--gold');
 if(v==='innodb')s+=path(fresh,old,70,'--color-rule-strong')+text(W/2,350,'Reconstruct from undo',22);
 else s+=text(W/2,350,'Both versions remain in the table',22);
 s+=labelLines(W/2,430,t>.75?['The old view still needs £20.','Cleanup must wait.']:['The writer commits £22.']);return svg(s,small,505);
}
function wal(t,small){
 const W=small?440:760,A=[65,125],M=[W/2,125],L=[W-70,125],D=[W-70,350];let s=path(A,M)+path(M,L)+path(M,D)+app(...A)+ring(...M,'Buffer',t>.18?'£22':'£20','--blue')+database(...L,'WAL',t>.52?'U · C':'')+database(...D,'Table file',t>.92?'£22':'£20');
 s+=travel(t,.02,.18,A,M,'--coral')+travel(t,.24,.38,M,L,'--blue')+travel(t,.4,.52,M,L,'--gold')+travel(t,.58,.73,L,A,'--teal','',-55)+travel(t,.78,.92,M,D,'--blue');
 s+=labelLines(W/2,455,t<.52?['Change record, then commit record.']:t<.78?['The log is durable.','The app can hear success.']:['The data page follows later.']);return svg(s,small,530);
}
export const scenes={
 buffers:makeScene('One page, two queries',10500,buffers,'The first query for the mug misses shared buffers and obtains page A. The later tea query finds its row on that cached page. The file read may itself be served by the operating-system cache.','A buffer miss is not necessarily a physical drive read.'),
 versions:makeScene('An earlier reader still needs £20',10000,versions,'After a writer commits £22, an established earlier snapshot still reads £20. PostgreSQL retains the old row version in the table. InnoDB reconstructs the older value from undo. Neither can discard required history yet.','The physical version is not a business price-history record.',actions([['pg','PostgreSQL'],['innodb','InnoDB']])),
 wal:makeScene('The log reaches storage before the reply',11500,wal,'An update changes the buffered price to £22. Its change record and commit record reach durable WAL before success is returned. The table page may still hold £20 and can be written later, after its WAL is durable.','U and C stand for change and commit records; this is an illustrative schedule.'),
 crash:makeScene('What survived the crash?',10000,recovery,'Before a durable commit survives, the recovered committed price is £20. After its durable commit it is £22, even if the reply was lost. A normal durable reply preserves £22; an early asynchronous reply can be followed by recovery to £20.','Power loss is modelled with surviving files and reliable flushes.',actions([['durable','Commit survives, reply lost'],['before','Before durable commit'],['reply','After durable reply'],['early','After early reply']]))
};
