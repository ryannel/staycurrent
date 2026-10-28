// A paper study of cache-aside: spatial distance is illustrative, not elapsed time.
const clamp = n => Math.max(0, Math.min(1, n));
const phase = (t,a,b) => clamp((t-a)/(b-a));
const ease = p => p*p*(3-2*p);
const txt = (x,y,value,size=24,extra='') => `<text x="${x}" y="${y}" font-size="${size}" ${extra.includes('fill=')?'':'fill="var(--study-ink)"'} ${extra}>${value}</text>`;
const line = (d,extra='') => `<path d="${d}" fill="none" stroke="var(--study-line)" stroke-width="1.5" ${extra}/>`;
const card = (x,y,{angle=0,opacity=1,scale=1}={}) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" opacity="${opacity}">
 <path d="M-59-52H43L59-36V56H-59Z" fill="var(--study-paper)" stroke="var(--study-ink)" stroke-width="1.5"/>
 <path d="M43-52V-36H59" fill="var(--study-soft)" stroke="var(--study-ink)" stroke-width="1.2"/>
 ${txt(-43,-23,'P7',23,'font-family="var(--font-mono)"')}
 ${txt(-43,7,'Blue mug',21,'font-family="var(--font-serif)"')}
 <path d="M-43 19H43" stroke="var(--study-line)"/>
 ${txt(-43,44,'£20',27,'font-family="var(--font-serif)"')}
 </g>`;
const bead = (x,y) => `<circle cx="${x}" cy="${y}" r="5" fill="var(--study-accent)"/>`;

function render(t) {
 t=clamp(t);
 const built=t>=.43,stored=t>=.61,hit=t>=.88;
 let body=`<defs><pattern id="paper-study-hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 1L1-1M0 7L7 0M6 8L8 6" stroke="var(--study-line)" stroke-width=".7"/></pattern></defs>
 <rect width="640" height="400" fill="var(--study-paper)"/>
 <g font-family="var(--font-sans)">`;
 body+=txt(30,35,hit?'Two answers. One source read.':t>=.65?'The next request':'The first request',25,'font-family="var(--font-serif)"');
 body+=txt(96,81,'App A',23,'text-anchor="middle"')+txt(329,81,'Saved copy',23,'text-anchor="middle"');
 // This longer route deliberately bends away from the cache: the app reads the source.
 body+=line('M99 222C99 317 251 333 412 316','stroke-dasharray="3 7"');
 body+=line('M158 151H266');
 body+=`<rect x="266" y="94" width="126" height="119" fill="url(#paper-study-hatch)"/>`;
 if(stored)body+=card(329,151,{angle:0});
 else body+=`<rect x="285" y="136" width="88" height="32" fill="var(--study-paper)"/>`+txt(329,159,'empty',23,'text-anchor="middle" fill="var(--study-muted)"');
 if(built)body+=card(96,151);
 else {
  body+=`<path d="M37 99H155V207H37Z" fill="var(--study-paper)" stroke="var(--study-line)"/>`;
  body+=txt(96,156,'P7?',28,'text-anchor="middle" font-family="var(--font-mono)"');
 }
 // A source record is deliberately different from the composed display card.
 body+=`<path d="M425 273H609V361H425Z" fill="var(--study-soft)" stroke="var(--study-ink)" stroke-width="1.2"/>`;
 body+=txt(439,302,'P7',23,'font-family="var(--font-mono)"')+txt(439,337,'price: £20',23,'font-family="var(--font-mono)"');
 body+=txt(517,390,'Source facts',23,'text-anchor="middle"');
 if(t>.16&&t<.24)body+=txt(213,133,'miss',22,'text-anchor="middle" fill="var(--study-muted)"');
 if(t>=.25)body+=txt(256,365,'1 source read',23,'text-anchor="middle"');
 if(t>.06&&t<.16){const p=ease(phase(t,.06,.16));body+=bead(158+108*p,151);}
 if(t>=.24&&t<.31){
  const p=ease(phase(t,.24,.31));
  const q=1-p;
  body+=bead(99*q*q*q+297*q*q*p+753*q*p*p+412*p*p*p,222*q*q*q+951*q*q*p+999*q*p*p+316*p*p*p);
 }
 if(t>=.33&&t<.43){
  const p=ease(phase(t,.33,.43)),x=425-329*p,y=316-127*p;
  body+=`<g transform="translate(${x} ${y}) rotate(${-4*Math.sin(p*Math.PI)})"><rect x="-55" y="-17" width="110" height="34" fill="var(--study-soft)" stroke="var(--study-ink)"/>${txt(0,8,'P7 · £20',23,'text-anchor="middle" font-family="var(--font-mono)"')}</g>`;
 }
 // A second sheet peels from the application's card, then settles into the saved place.
 if(t>=.47&&t<.61){
  const p=ease(phase(t,.47,.61));
  body+=card(96+233*p,151-27*Math.sin(p*Math.PI),{angle:-5*Math.sin(p*Math.PI)});
 }
 if(t>=.65&&t<.73){const p=ease(phase(t,.65,.73));body+=bead(158+108*p,151);}
 if(t>=.76&&t<.88){
  const p=ease(phase(t,.76,.88));
  body+=card(329-233*p,151+26*Math.sin(p*Math.PI),{angle:4*Math.sin(p*Math.PI)});
 }
 if(stored)body+=txt(329,244,'ready to reuse',22,'text-anchor="middle" fill="var(--study-muted)"');
 if(hit){
  body+=`<path d="M160 151H264" stroke="var(--study-accent)" stroke-width="2.5"/>`;
  body+=txt(213,134,'hit',23,'text-anchor="middle"');
 }
 body+='</g>';
 return `<svg viewBox="0 0 640 400" aria-hidden="true">${body}</svg>`;
}

export const scene = {
 title:'Paper and motion', duration:10000,
 alt:'App A misses an empty cache, reads the source’s P7 facts and builds a £20 blue-mug display card. A second sheet is saved in the cache. The next request reuses that sheet along the short route, leaving the source-read count at one.',
 caption:'App A turns source facts into a product card, then keeps a copy. The next request reuses the copy. North’s English P7 card in GBP; distances and timing are illustrative.',
 render
};
