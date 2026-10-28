// Explanatory choreography: these times are not cache or database timings.
const clamp = n => Math.max(0, Math.min(1, n));
const phase = (t, a, b) => clamp((t - a) / (b - a));
const smooth = n => n * n * (3 - 2 * n);
const mix = (a, b, t) => a + (b - a) * t;
const tag = (x, y, value, cls = '', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${value}</text>`;

function definitions(id) {
  return `<defs>
    <linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--dc-card)"/><stop offset="1" stop-color="var(--dc-card-shade)"/></linearGradient>
    <linearGradient id="${id}-metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--dc-metal-light)"/><stop offset=".45" stop-color="var(--dc-metal)"/><stop offset="1" stop-color="var(--dc-metal-shade)"/></linearGradient>
    <linearGradient id="${id}-mug" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="var(--dc-blue-light)"/><stop offset=".4" stop-color="var(--dc-blue)"/><stop offset="1" stop-color="var(--dc-blue-dark)"/></linearGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--dc-glass)" stop-opacity=".65"/><stop offset=".4" stop-color="var(--dc-glass)" stop-opacity=".08"/><stop offset="1" stop-color="var(--dc-glass)" stop-opacity=".25"/></linearGradient>
    <radialGradient id="${id}-light"><stop stop-color="var(--dc-halo)" stop-opacity=".85"/><stop offset="1" stop-color="var(--dc-halo)" stop-opacity="0"/></radialGradient>
    <filter id="${id}-shadow" x="-50%" y="-40%" width="200%" height="200%"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="var(--dc-shadow)" flood-opacity=".22"/></filter>
  </defs>`;
}

function mug(id, x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="36" rx="36" ry="7" fill="var(--dc-shadow)" opacity=".12"/>
    <path d="M25-15 C60-19 62 24 27 24 L27 11 C43 13 46-3 27-4Z" fill="url(#${id}-mug)"/>
    <path d="M-32-26 L-27 24 Q-25 40 0 40 Q25 40 27 24 L32-26Z" fill="url(#${id}-mug)"/>
    <ellipse cx="0" cy="-26" rx="32" ry="10" fill="var(--dc-blue-light)"/>
    <ellipse cx="0" cy="-26" rx="26" ry="6" fill="var(--dc-blue-dark)"/>
    <path d="M-21-12 L-18 17 Q-17 25-12 27" fill="none" stroke="var(--dc-glass)" stroke-width="5" stroke-linecap="round" opacity=".65"/>
  </g>`;
}

function stage(id, height, body) {
  let grid = '';
  for (let x = 24; x < 560; x += 24) for (let y = 24; y < height; y += 24) grid += `<circle cx="${x}" cy="${y}" r=".7" fill="var(--dc-grid)"/>`;
  return `<svg viewBox="0 0 560 ${height}" aria-hidden="true" class="dc-material-scene">${definitions(id)}<rect width="560" height="${height}" rx="24" fill="var(--dc-ground)"/><ellipse cx="280" cy="245" rx="270" ry="235" fill="url(#${id}-light)"/>${grid}${body}</svg>`;
}

function ticket(x, y, key, tone, rotation = 0, scale = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="M-80-25 H80 V-10 A10 10 0 0 0 80 10 V25 H-80 V10 A10 10 0 0 0-80-10Z" fill="var(--dc-${tone})" stroke="var(--dc-edge)" stroke-width="1"/>${tag(0, 8, key, 'dc-key')}</g>`;
}

function shop(x, name, price, tone) {
  return `<g class="dc-shop" transform="translate(${x} 83)">
    <rect x="-105" y="-25" width="210" height="93" rx="18" fill="var(--dc-card)" stroke="var(--dc-edge)"/>
    <path d="M-105-7 V-8 Q-105-25-87-25 H87 Q105-25 105-8 V-7Z" fill="var(--dc-${tone})"/>
    ${tag(-79, 23, name, 'dc-shop-name', 'start')}${tag(-79, 50, `P7 · £${price}`, 'dc-small', 'start')}
    ${mug('identity', 64, 21, .55)}
  </g>`;
}

function drawer(x, y, key, price, tone, scale = 1, opacity = 1) {
  return `<g opacity="${opacity}" transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="137" rx="92" ry="13" fill="var(--dc-shadow)" opacity=".12"/>
    <path d="M-90-50 L-100-34 V126 Q-100 140-86 140 H86 Q100 140 100 126 V-34 L90-50Z" fill="url(#identity-metal)" stroke="var(--dc-edge)"/>
    <rect x="-88" y="-37" width="176" height="157" rx="12" fill="var(--dc-slot)"/>
    <g filter="url(#identity-shadow)"><rect x="-72" y="-24" width="144" height="135" rx="10" fill="url(#identity-paper)"/>
      <rect x="-72" y="-24" width="144" height="9" rx="4" fill="var(--dc-${tone})"/>
      ${mug('identity', -3, 19, .63)}${tag(0, 91, `£${price}`, 'dc-price')}
    </g>
    <path d="M-100 111 H-30 Q-23 131 0 131 Q23 131 30 111 H100 V126 Q100 140 86 140 H-86 Q-100 140-100 126Z" fill="url(#identity-metal)"/>
    <rect x="-77" y="-67" width="154" height="39" rx="19" fill="var(--dc-card)" stroke="var(--dc-edge)"/>
    ${tag(0, -40, key, 'dc-key')}
  </g>`;
}

function identity(t, variant = 'story') {
  const separate = variant === 'separate' ? smooth(phase(t, .12, .58)) : variant === 'merged' ? 0 : smooth(phase(t, .48, .71));
  const arrived = variant === 'story' ? smooth(phase(t, .06, .20)) : 1;
  const spread = separate;
  const lx = mix(280, 150, spread), rx = mix(280, 410, spread);
  const wrong = separate < .5;
  const switchReady = separate > .62;
  let s = tag(280, 35, wrong ? 'One address. Two different answers.' : 'Give each answer its own address.', 'dc-heading');
  s += shop(145, 'north', '20', 'mint') + shop(415, 'south', '18', 'lilac');
  // Keys move along the visible lanes; the machine compares key designs, not a live migration.
  s += `<path d="M145 154 C145 192 ${lx} 181 ${lx} 252 M415 154 C415 192 ${rx} 181 ${rx} 252" fill="none" stroke="var(--dc-track)" stroke-width="8" stroke-linecap="round"/>`;
  s += `<path d="M145 154 C145 192 ${lx} 181 ${lx} 252 M415 154 C415 192 ${rx} 181 ${rx} 252" fill="none" stroke="var(--dc-edge)" stroke-width="1" stroke-dasharray="2 9"/>`;
  const ticketY = mix(154, 207, arrived);
  const wobble = Math.sin(phase(t, .48, .77) * Math.PI * 3) * (1 - phase(t, .48, .77)) * 3;
  if (spread < .45) {
    s += ticket(mix(145, 235, arrived), ticketY - 14, 'P7', 'mint', -7);
    s += ticket(mix(415, 325, arrived), ticketY + 24, 'P7', 'lilac', 7);
  } else {
    s += ticket(lx, 207, 'north:P7', 'mint', -wobble, .95);
    s += ticket(rx, 207, 'south:P7', 'lilac', wobble, .95);
  }
  if (spread < .01) s += drawer(280, 326, 'P7', '20', 'mint');
  else {
    s += drawer(lx, 326, switchReady ? 'north:P7' : 'P7', '20', 'mint', mix(1, .95, spread));
    s += drawer(rx, 326, switchReady ? 'south:P7' : 'P7', '18', 'lilac', mix(.6, .95, spread), spread);
  }
  if (wrong) {
    const a = smooth(phase(t, .22, .31));
    s += `<g opacity="${variant === 'merged' ? 1 : a}"><rect x="87" y="478" width="386" height="38" rx="19" fill="var(--dc-warning)"/>${tag(280, 504, 'South’s card is £18. This copy says £20.', 'dc-small dc-on-tint')}</g>`;
  } else {
    s += `<rect x="65" y="478" width="430" height="38" rx="19" fill="var(--dc-mint)"/>${tag(280, 504, 'Two shop keys. Two correct answers.', 'dc-small dc-on-tint')}`;
  }
  return stage('identity', 536, s);
}

function priceCard(x, y, value, rotation = 0, opacity = 1, fold = 0, source = false) {
  const flip = source ? Math.max(.04, Math.abs(Math.cos(fold * Math.PI))) : 1;
  return `<g opacity="${opacity}" transform="translate(${x} ${y}) rotate(${rotation})">
    <g filter="url(#change-shadow)"><rect x="-87" y="-107" width="174" height="214" rx="16" fill="url(#change-paper)" stroke="var(--dc-edge)"/>
      <path d="M-87-86 V-91 Q-87-107-71-107 H71 Q87-107 87-91 V-86Z" fill="var(--dc-mint)"/>
      ${tag(0, -58, 'north / P7', 'dc-key')}${mug('change', -6, -13, .94)}
      <g transform="translate(0 75) scale(1 ${flip})">${tag(0, 0, `£${value}`, 'dc-price-large')}</g>
    </g>
  </g>`;
}

function token(x, y, value) {
  return `<g transform="translate(${x} ${y})"><rect x="-40" y="-17" width="80" height="34" rx="17" fill="var(--dc-ink)"/>${tag(0, 7, value, 'dc-token')}</g>`;
}

function change(t, variant = 'story') {
  const flip = phase(t, .18, .28), committed = t >= .23;
  const held = variant === 'delay';
  const remove = held ? 0 : smooth(phase(t, .69, .85));
  const deleted = remove === 1;
  const stale = committed && !deleted;
  let s = tag(145, 42, 'Source', 'dc-heading') + tag(415, 42, 'Cached copy', 'dc-heading');
  s += tag(145, 72, 'The accepted price', 'dc-small') + tag(415, 72, 'A saved answer', 'dc-small');
  // Sculpted plinths and the retained transparent sleeve distinguish source and detached copy.
  for (const x of [145, 415]) {
    s += `<ellipse cx="${x}" cy="350" rx="104" ry="19" fill="var(--dc-shadow)" opacity=".12"/>`;
    s += `<path d="M${x-99} 329 V342 Q${x-99} 360 ${x} 360 Q${x+99} 360 ${x+99} 342 V329Z" fill="var(--dc-metal-shade)"/>`;
    s += `<ellipse cx="${x}" cy="329" rx="99" ry="18" fill="url(#change-metal)"/>`;
  }
  s += priceCard(145, 216, committed ? '22' : '20', 0, 1, flip, true);
  s += `<rect x="319" y="99" width="192" height="229" rx="20" fill="var(--dc-slot)" stroke="var(--dc-edge)"/>`;
  if (!deleted) {
    s += priceCard(415 + remove * 25, 216 + remove * 102, '20', remove * 25, 1 - remove);
    if (remove > 0) s += `<path d="M${328+remove*20} ${109+remove*60} Q430 ${110+remove*80} ${501+remove*20} ${125+remove*90}" fill="none" stroke="var(--dc-card)" stroke-width="${8*(1-remove)}" opacity="${1-remove}"/>`;
  } else {
    s += `<path d="M350 179 L365 164 M465 164 L480 179 M350 251 L365 266 M465 266 L480 251" fill="none" stroke="var(--dc-edge)" stroke-width="2"/>`;
    s += tag(415, 211, 'empty', 'dc-empty') + tag(415, 246, 'was £20', 'dc-small');
  }
  s += `<path d="M319 200 V309 Q319 328 338 328 H492 Q511 328 511 309 V200 L496 216 H334Z" fill="url(#change-glass)" stroke="var(--dc-glass-edge)" stroke-width="1.5"/>`;
  s += `<path d="M328 105 L349 105 M498 114 L498 174" fill="none" stroke="var(--dc-glass)" stroke-width="3" stroke-linecap="round" opacity=".75"/>`;
  if (committed) s += `<rect x="77" y="370" width="136" height="34" rx="17" fill="var(--dc-mint)"/>${tag(145, 394, '£22 committed', 'dc-small dc-on-tint')}`;
  if (stale) s += `<rect x="343" y="370" width="144" height="34" rx="17" fill="var(--dc-warning)"/>${tag(415, 394, 'Still £20', 'dc-small dc-on-tint')}`;
  if (deleted) s += tag(415, 394, '£20 copy removed', 'dc-small');
  s += `<path d="M244 453 C169 453 145 439 145 414 M316 453 C391 453 415 439 415 414" fill="none" stroke="var(--dc-track)" stroke-width="4"/>`;
  s += `<rect x="224" y="433" width="112" height="41" rx="20" fill="var(--dc-card)" stroke="var(--dc-edge)"/>${tag(280, 460, 'App A', 'dc-key')}`;
  const commitP = smooth(phase(t, .08, .18)), deleteP = smooth(phase(t, .57, .69));
  if (t >= .08 && t <= .18) s += token(mix(244, 145, commitP), mix(453, 414, commitP), 'write');
  if (!held && t >= .57 && t <= .69) s += token(mix(316, 415, deleteP), mix(453, 414, deleteP), 'DEL');
  s += tag(280, 513, held ? 'The source changed. Its saved copy did not.' : deleted ? 'Commit first. Delete the detached copy afterwards.' : stale ? 'Two copies can disagree.' : 'A copy can outlive the fact it copied.', 'dc-small');
  return stage('change', 536, s);
}

export const scenes = {
  identity: {
    title: 'A key is an address for an answer',
    caption: 'P7 alone sends south to north’s £20 card. Including the shop keeps the £20 and £18 answers apart. These are alternative key designs, with entries already filled; language, currency and format are omitted from the short labels.',
    alt: 'North’s P7 costs £20 and south’s costs £18. A shared key P7 returns north’s £20 card for both shops. Separate north:P7 and south:P7 keys return the correct card to each shop.',
    duration: 14000,
    durationFor: variant => variant === 'story' ? 14000 : 4000,
    render: identity,
    actions: [{ value: 'merged', label: 'Use only P7' }, { value: 'separate', label: 'Include shop' }]
  },
  change: {
    title: 'The price changes. The copy stays still.',
    caption: 'App A commits £22 at the source, then deletes the old £20 copy. Deleting leaves an empty cache; the next request must fetch a replacement. This illustration contains no overlapping read, and its timing is not a freshness limit.',
    alt: 'Two product cards begin at £20. The source commits £22 while the detached cached card remains £20. App A subsequently deletes the old card, leaving an empty cache and the £22 source.',
    altFor: variant => variant === 'delay' ? 'The source commits £22, but App A delays deletion. The source still says £22 while the saved card remains £20.' : 'The source commits £22 while its cached copy remains £20. App A then deletes the old copy, leaving the cache empty.',
    duration: 14000,
    render: change
  }
};
