// Browser -> application server -> cache or source. Cache-aside illustration.
const clamp=x=>Math.max(0,Math.min(1,x));
const phase=(t,a,b)=>clamp((t-a)/(b-a));
const label=(x,y,s,n=23,c='--study-ink',a='middle',f='sans')=>`<text x="${x}" y="${y}" text-anchor="${a}" style="font:400 ${n}px var(--font-${f});fill:var(${c})">${s}</text>`;
const line=(d,accent=false,w=1.7)=>`<path d="${d}" fill="none" stroke="var(${accent?'--study-accent':'--study-line'})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const mug=(x,y,z=1)=>`<g transform="translate(${x} ${y}) scale(${z})">${line('M-13-13H10V8Q10 16 2 16H-5Q-13 16-13 8ZM10-8H15Q24-8 24 0Q24 8 10 8',true,2.5)}</g>`;
const card=(x,y,r=0,o=1)=>`<g transform="translate(${x} ${y}) rotate(${r})" opacity="${o}"><rect x="-29" y="-35" width="58" height="70" rx="4" fill="var(--study-paper)" stroke="var(--study-accent)" stroke-width="1.8"/>${mug(-3,-13,.65)}${label(0,23,'£20',21)}</g>`;
// Redis R symbol from Simple Icons (CC0), icons/redis.svg.
const redisMark='M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73zm-4.349-5.013c0 1.959-1.926 2.922-3.685 2.922-.941 0-1.664-.247-2.235-.568 1.051-1.592 2.092-3.225 3.21-4.973 1.972.334 2.71 1.43 2.71 2.619z';
function packet(t,a,b,from,to,control,kind='request'){
 if(t<a||t>=b)return '';
 const u=phase(t,a,b),p=u*u*(3-2*u),q=1-p;
 const x=q*q*from[0]+2*q*p*control[0]+p*p*to[0],y=q*q*from[1]+2*q*p*control[1]+p*p*to[1];
 if(kind==='card')return card(x,y,Math.sin(p*Math.PI)*-9);
 if(kind==='facts')return `<g transform="translate(${x} ${y})"><rect x="-26" y="-16" width="52" height="32" rx="3" fill="var(--study-paper)"/>${label(0,8,'£20',22)}</g>`;
 return `<circle cx="${x}" cy="${y}" r="5" fill="var(--study-accent)" stroke="var(--study-paper)" stroke-width="2"/>`;
}
function rack(x,y,active=false,t=0){
 let s=`<g transform="translate(${x} ${y})">`;
 for(let i=0;i<3;i++){
  s+=`<rect x="-32" y="${-33+i*23}" width="64" height="19" rx="3" fill="var(--study-paper)" stroke="var(--study-ink)" stroke-width="1.6"/>`;
  s+=line(`M-22 ${-23+i*23}H5`,false,1.2);
  s+=`<circle cx="22" cy="${-23+i*23}" r="2.7" fill="var(${active&&Math.floor(t*70)%3===i?'--study-accent':'--study-muted'})"/>`;
 }
 return s+'</g>';
}
function render(t){
 t=clamp(t);
 const saved=t>=.58,read=t>=.36,first=t>=.67,second=t>=.98;
 const headline=t<.12?'A shopper opens a product.':t<.27?'Nothing saved. Yet.':t<.46?'Read the database once.':t<.60?'Build the card. Keep a copy.':t<.72?'The first answer arrives.':t<.85?'Another request. Same product.':t<.98?'This time, take the shortcut.':'One database read. Two answers.';
 let s=`<svg viewBox="0 0 640 440" aria-hidden="true"><rect width="640" height="440" fill="var(--study-paper)"/>`;
 s+=label(24,34,headline,27,'--study-ink','start','serif');
 s+=line('M145 222H246',first,first?2.4:1.5);
 s+=line('M314 204Q370 130 461 130',saved,saved?2.4:1.5);
 s+=line('M314 242Q373 330 470 330');
 s+=label(84,149,'North shop',24);
 s+=`<rect x="24" y="172" width="120" height="100" rx="5" fill="var(--study-paper)" stroke="var(--study-ink)" stroke-width="1.7"/>`;
 s+=line('M24 191H144',false,1);
 for(let i=0;i<3;i++)s+=`<circle cx="${35+i*8}" cy="182" r="1.8" fill="var(--study-muted)"/>`;
 s+=first?mug(60,228,.85)+label(111,237,'£20',23):label(84,237,'P7',25,'--study-muted');
 s+=label(84,303,'Browser',22,'--study-muted');
 s+=label(84,334,second?'2 answers':first?'1 answer':'',22,'--study-accent');
 s+=rack(280,222,(t>.1&&t<.67)||(t>.77&&t<.98),t);
 s+=label(280,295,'Shop server',24);
 s+=`<g transform="translate(469 102) scale(2.4)" fill="var(--study-ink)"><path d="${redisMark}"/></g>`;
 s+=label(500,85,'Redis',25)+label(500,193,'Cache',22,'--study-muted');
 s+=saved?card(584,132):label(582,139,t>=.2&&t<.28?'miss':'empty',21,'--study-muted');
 s+=rack(505,330,t>=.34&&t<.4,t);
 s+=label(505,391,'Database',24)+label(505,421,read?'1 read':'0 reads',22,'--study-muted')+label(582,338,'£20',23,'--study-muted');
 for(const [at,x,y] of [[.1,280,222],[.58,500,130],[.67,84,222],[.85,500,130],[.98,84,222]]){
  const p=phase(t,at,Math.min(1,at+.035));
  if(p>0&&p<1)s+=`<circle cx="${x}" cy="${y}" r="${30+20*p}" fill="none" stroke="var(--study-accent)" stroke-width="1.6" opacity="${1-p}"/>`;
 }
 s+=packet(t,.02,.10,[145,222],[246,222],[195,222]);
 s+=packet(t,.12,.20,[314,204],[461,130],[370,130]);
 s+=packet(t,.22,.27,[461,130],[314,204],[370,130]);
 s+=packet(t,.28,.36,[314,242],[470,330],[373,330]);
 s+=packet(t,.38,.46,[470,330],[314,242],[373,330],'facts');
 if(t>=.46&&t<.50)s+=card(280,222,0,phase(t,.46,.49));
 s+=packet(t,.50,.58,[280,222],[584,132],[392,76],'card');
 s+=packet(t,.60,.67,[246,222],[84,222],[165,190],'card');
 s+=packet(t,.72,.77,[145,222],[246,222],[195,222]);
 s+=packet(t,.78,.85,[314,204],[461,130],[370,130]);
 s+=packet(t,.86,.92,[584,132],[280,222],[392,76],'card');
 s+=packet(t,.93,.98,[246,222],[84,222],[165,190],'card');
 return s+'</svg>';
}
export const scene={
 title:'The route map',duration:14000,render,
 alt:'A shopper’s browser asks the shop server for P7. The server checks Redis, misses, reads the database, builds the £20 mug card, saves a copy in Redis and replies. A second browser request is answered through Redis without another database read.',
 caption:'The shop server checks the cache; the browser only talks to the server. Redis is our example cache, one of many choices. P7 is north’s English product card in GBP. Timing is illustrative.'
};
