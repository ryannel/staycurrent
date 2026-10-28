// An editorial map: the objects and travelling marks carry the sequence.
const clamp = x => Math.max(0, Math.min(1, x));
const phase = (t,a,b) => clamp((t-a)/(b-a));
const ease = p => p*p*(3-2*p);
const label = (x,y,s,size=23,colour='--study-ink',anchor='start',family='sans') => `<text x="${x}" y="${y}" text-anchor="${anchor}" style="font:400 ${size}px var(--font-${family});fill:var(${colour})">${s}</text>`;
const line = (d,accent=false,width=1.7,dash='') => `<path d="${d}" fill="none" stroke="var(${accent?'--study-accent':'--study-line'})" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''} stroke-linecap="round"/>`;
const card = (x,y,opacity=1,rotation=0,small=false) => `<g opacity="${opacity}" transform="translate(${x} ${y}) rotate(${rotation})"><rect x="-45" y="-38" width="90" height="76" rx="2" fill="var(--study-paper)" stroke="var(--study-ink)" stroke-width="1.4"/>${line('M-34-10H34',false,1)}${label(0,-18,'P7',small?19:22,'--study-muted','middle','mono')}${label(0,24,'£20',28,'--study-ink','middle')}</g>`;
function packet(t,a,b,from,to,control,kind='dot') {
 if(t<a||t>b)return '';
 const p=ease(phase(t,a,b)),q=1-p;
 const x=q*q*from[0]+2*q*p*control[0]+p*p*to[0];
 const y=q*q*from[1]+2*q*p*control[1]+p*p*to[1];
 return kind==='card'?card(x,y,1,Math.sin(p*Math.PI)*-5,true):kind==='facts'?`<g transform="translate(${x} ${y})"><rect x="-36" y="-17" width="72" height="34" rx="2" fill="var(--study-paper)"/>${label(0,8,'£20',23,'--study-ink','middle')}</g>`:`<circle cx="${x}" cy="${y}" r="5" fill="var(--study-accent)" stroke="var(--study-paper)" stroke-width="2"/>`;
}
function render(t) {
 t=clamp(t);
 const filled=t>=.59,sourceRead=t>=.34,built=t>=.46,hit=t>=.87;
 let s=`<svg viewBox="0 0 640 390" aria-hidden="true"><rect width="640" height="390" fill="var(--study-paper)"/>`;
 s+=label(30,37,'One source read. Two answers.',27,'--study-ink','start','serif');
 s+=line('M30 55H610',false,1);
 // Both routes remain visible. Only the reuse route becomes the accent.
 s+=line('M157 201Q247 132 382 132',filled,filled?2.4:1.7);
 s+=line('M157 245Q245 337 382 318',false,1.7);
 s+=label(272,99,filled?'reuse':'look up',22,'--study-muted','middle');
 s+=label(267,365,'read the source',22,'--study-muted','middle');
 // The app is a typographic junction, not a machine or a display cabinet.
 s+=label(104,193,'App A',26,'--study-ink','middle');
 s+=line('M53 205H155',true,2.5);
 s+=label(104,239,built?'£20':'P7?',30,'--study-ink','middle');
 s+=label(104,275,hit?'2 answers':filled?'1 answer':built?'build card':'request',21,'--study-muted','middle');
 // The cache has a labelled, visibly empty place until App A saves the copy.
 s+=label(440,92,'Cache',25,'--study-ink','middle');
 if(filled)s+=card(440,143);
 else s+=`<rect x="395" y="105" width="90" height="76" rx="2" fill="none" stroke="var(--study-line)" stroke-width="1.4" stroke-dasharray="3 5"/>`+label(440,150,'empty',21,'--study-muted','middle');
 s+=label(550,150,hit?'hit':filled?'saved':t>.19&&t<.3?'miss':'',23,'--study-accent','middle');
 // Source facts are never turned into a cache card directly: they return to App A.
 s+=label(440,271,'Source',25,'--study-ink','middle');
 s+=line('M390 287H490',false,1.2);
 s+=label(440,322,'P7 · £20',24,'--study-ink','middle');
 s+=label(550,319,sourceRead?'1 read':'0 reads',22,'--study-muted','middle');
 s+=packet(t,.08,.18,[157,201],[382,132],[247,132]);
 s+=packet(t,.25,.34,[157,245],[382,318],[245,337]);
 s+=packet(t,.36,.45,[382,318],[157,245],[245,337],'facts');
 // The brief card construction sits with its owner, App A.
 if(t>=.45&&t<.51){const p=phase(t,.45,.51);s+=card(104,235-16*Math.sin(p*Math.PI),Math.sin(p*Math.PI),0);}
 s+=packet(t,.51,.59,[157,201],[440,143],[247,90],'card');
 s+=packet(t,.69,.77,[157,201],[382,132],[247,132]);
 s+=packet(t,.79,.87,[440,143],[157,201],[247,90],'card');
 return s+'</svg>';
}
export const scene={
 title:'The route map',duration:10000,render,
 alt:'App A first misses an empty cache, reads £20 facts from the source, builds P7’s product card and saves a copy. The next request reuses that card. Two answers need one source read.',
 caption:'The first request does the source work. App A saves the card; the next request follows the shorter route. P7 is north’s English card in GBP. Timing is illustrative.'
};
