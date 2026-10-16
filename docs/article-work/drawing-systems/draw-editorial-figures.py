from pathlib import Path
from html import escape
OUT=Path('public/images/drawing-systems')
STYLE='''<style>svg{--paper:#f0ede5;--ink:#34322e;--muted:#615d55;--blue:#275f85;--green:#306b48;--red:#a43e39;--purple:#764d89;background:var(--paper)}text{font:19px system-ui,sans-serif;fill:var(--ink)}.head{font-size:21px;font-weight:600}.small{font-size:18px}.note{fill:var(--muted)}.line{fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.box{fill:var(--paper);stroke:var(--ink);stroke-width:2}.blue{stroke:var(--blue)}.green{stroke:var(--green)}.red{stroke:var(--red)}.purple{stroke:var(--purple)}.label{paint-order:stroke;stroke:var(--paper);stroke-width:8;stroke-linejoin:round}@media(prefers-color-scheme:dark){svg{--paper:#262320;--ink:#e2dccf;--muted:#b5aea0;--blue:#91bfe2;--green:#a1ceaa;--red:#efa59c;--purple:#ceb0e0}}@media print{svg{--paper:#fff;--ink:#222;--muted:#444;--blue:#275f85;--green:#306b48;--red:#a43e39;--purple:#764d89}}</style>'''
def text(x,y,t,cls='',anchor='start'):return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}">{escape(t)}</text>'
def box(x,y,w,h,label,cls=''):
 s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" class="box {cls}"/>'
 lines=label.split('|')
 for i,l in enumerate(lines):s+=text(x+w/2,y+h/2+(i-(len(lines)-1)/2)*24+6,l,anchor='middle')
 return s
def arrow(points,cls=''):
 pts=points.split(' '); end=pts[-1].split(','); prev=pts[-2].split(','); x,y=map(float,end);px,py=map(float,prev)
 import math
 a=math.atan2(y-py,x-px);r=9
 return f'<polyline points="{points}" class="line {cls}"/>'+f'<path d="M{x-r*math.cos(a-.5)},{y-r*math.sin(a-.5)} L{x},{y} L{x-r*math.cos(a+.5)},{y-r*math.sin(a+.5)}" class="line {cls}"/>'
def save(name,h,body,title):
 (OUT/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="520" height="{h}" viewBox="0 0 520 {h}" role="img"><title>{escape(title)}</title>{STYLE}{body}</svg>')
b=text(24,36,'One repair request, three questions','head')
b+=text(24,84,'STRUCTURE · Which parts communicate?','small')
b+=box(24,110,130,60,'Browser')+box(202,110,110,60,'API')+box(366,110,130,60,'Database')
b+=arrow('154,140 202,140')+arrow('312,140 366,140')+text(178,200,'calls',anchor='middle')+text(340,200,'writes',anchor='middle')
b+=text(24,264,'PROCESS · Who does the work?','small')+box(24,288,220,100,'Coordinator|Checks request')+box(284,288,212,100,'Technician|Diagnoses fault')+arrow('244,338 284,338')
b+=text(24,428,'The arrow passes work to the next activity.','small note')
b+=text(24,490,'LIFECYCLE · When may repair begin?','small')+box(24,514,200,70,'Awaiting|approval')+box(310,514,186,70,'Approved')+arrow('224,549 310,549')+text(267,624,'customer approves quote',anchor='middle')
save('overview-views',650,b,'Structure, process and lifecycle views of a repair service')
b=text(24,36,'A drawing assembled as people spoke','head')
b+=box(36,90,146,60,'Browser')+box(322,110,154,60,'Repair DB')+box(190,250,150,60,'Repair API')+box(30,410,176,70,'Notification|provider')+box(320,420,176,70,'Worker')
b+=arrow('182,120 265,120 265,250')+arrow('340,280 399,280 399,170')+arrow('408,420 408,190 399,190 399,170')+arrow('320,455 206,455')
b+=text(250,98,'submits', 'small label')+text(348,246,'writes','small label')+text(417,349,'reads','small label')+text(250,443,'sends','small label',anchor='middle')
b+=text(24,550,'The API is read before the browser.','small note')+text(24,580,'Arrows reverse direction across the board.','small note')+text(24,610,'Spacing hides the two paths.','small note')
save('layout-before',640,b,'Before layout repair: correct parts scattered in the order they were mentioned')
b=text(24,36,'The same parts, arranged around two jobs','head')+text(24,82,'RECORD THE REQUEST','small')
b+=box(24,110,140,64,'Browser')+box(350,110,146,64,'Repair API')+arrow('164,142 350,142')+text(257,126,'submits','small label',anchor='middle')
b+=box(350,254,146,64,'Repair DB')+arrow('423,174 423,254')+text(405,218,'writes','small label',anchor='end')
b+=text(24,354,'SEND A NOTIFICATION','small')+box(24,382,160,70,'Worker')+arrow('184,417 268,417 268,286 350,286')+text(265,470,'reads stored jobs','small label',anchor='middle')
b+=box(24,536,210,70,'Notification|provider')+arrow('104,452 104,536')+text(120,502,'sends email','small label')
b+=text(270,568,'Arrow = uses / calls','small note')+text(270,597,'Not a time scale','small note')
save('layout-after',640,b,'After layout repair: browser calls API, API writes database, worker reads jobs and calls notification provider')
b=text(24,36,'Five pens, five roles','head')
for i,(colour,label,desc) in enumerate([('', 'Black · structure','Named things and confirmed links'),('blue','Blue · trace ① ②','The path currently being discussed'),('green','Green · NEW','A proposed change; not implemented'),('red','Red · ! ISSUE','An observed problem to investigate'),('purple','Purple · ? CHECK','An assumption or unanswered question')]):
 y=75+i*91;b+=f'<path d="M28,{y+18} L78,{y+18}" class="line {colour}" style="stroke-width:4"/>'+text(96,y+12,label)+text(96,y+42,desc,'small note')
b+=text(24,566,'Keep the words and marks on a black copy.','small note')
save('layout-colours',600,b,'Five colour roles with labels and symbols that remain meaningful without colour')
b=text(24,36,'An annotation sits beside the relationship','head')+box(24,84,150,68,'Worker')+box(310,84,186,68,'Provider')+arrow('174,118 310,118','blue')+text(240,184,'① sends email','label',anchor='middle')
b+=f'<path d="M242,194 L242,236" class="line purple"/>'+text(28,274,'? CHECK · Does the provider deduplicate?')+text(28,310,'Owner: Sam · verify the API contract','small note')
b+=text(24,380,'A proposal belongs in a separate panel','head')+box(24,420,150,68,'Worker','green')+box(310,420,186,68,'Provider')+arrow('174,454 310,454','green')+text(240,518,'NEW · send a request key','label',anchor='middle')
b+=text(24,571,'Proposed; behaviour still needs verification.','small note')
save('layout-annotations',600,b,'Current unknown provider behaviour and a separate proposed request key change')
b=text(24,36,'A mismatch between two views','head')+text(24,80,'PROCESS · stated policy','small')+box(24,105,205,70,'Approved|quote')+box(310,105,186,70,'Cancelled')+arrow('229,140 310,140')+text(260,215,'cancel before repair starts','label',anchor='middle')
b+=text(24,280,'LIFECYCLE · incomplete draft','small')+box(24,307,205,70,'Approved')+box(310,307,186,70,'Repairing')+arrow('229,342 310,342')+text(267,418,'start repair','label',anchor='middle')
b+=text(24,487,'! Cancellation has no transition here.','head')+text(24,527,'Which view matches the agreed policy?','small')+text(24,566,'Check evidence before repairing the picture.','small note')
save('maintaining-mismatch',600,b,'The process permits cancellation after approval but an incomplete lifecycle has only start repair')
