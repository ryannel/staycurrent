import { offers, advice, project, pairwiseJoin, lineRules, lineAttributes } from './model.mjs';
const code = s => `<code>${s}</code>`;
const table = (caption, heads, rows, marks = []) => `<div class="nf-table" tabindex="0" role="region" aria-label="${caption}"><table><caption>${caption}</caption><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr${marks.includes(i) ? ' class="nf-mark"' : ''}>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const boxes = items => `<div class="nf-boxes">${items.map(([title, text]) => `<div class="nf-box"><p class="nf-label">${title}</p><p>${text}</p></div>`).join('')}</div>`;
const arrow = label => `<p class="nf-arrow">↓ <span>${label}</span></p>`;
const scene = (html, explanation) => ({ html, explanation });
function closureCase(seed, description) {
  let known = [...seed];
  const states = [scene('', `Start with ${description}. The filled boxes are the attributes already known; an unfilled box has not been reached.`)];
  const snapshots = [[...known]];
  for (const [left, right] of lineRules) {
    if (left.every(a => known.includes(a)) && right.some(a => !known.includes(a))) {
      const added = right.filter(a => !known.includes(a));
      known = [...known, ...added]; snapshots.push([...known]);
      states.push(scene('', `${left.join(' + ')} → ${right.join(' + ')} adds ${added.join(', ')}. Keep everything reached so far.`));
    }
  }
  snapshots.push([...known]);
  states.push(scene('', known.length === lineAttributes.length ? 'No further attribute can be added. All seven are reached: this seed is a superkey. Removing either starting attribute prevents that, so it is a candidate key.' : 'No further attribute can be added. Some attributes remain unreached: this seed is not a superkey. Stop at the fixed point, even though not every box is filled.'));
  return {label: description, stages: states.map((s, i) => ({...s, html: `<p class="nf-label">Start: ${seed.map(code).join(' + ')}</p><div class="nf-chips">${lineAttributes.map(a => `<span class="${snapshots[i].includes(a) ? 'nf-known' : ''}">${a}<small>${snapshots[i].includes(a) ? 'reached' : 'not reached'}</small></span>`).join('')}</div><p class="nf-result">${snapshots[i].length} / 7 attributes reached</p>`}))};
}
const chaseHeaders = ['Projection', 'order', 'line', 'customer', 'name'];
const chaseRows = [
  ['order / line', 'a<sub>O</sub>', 'a<sub>L</sub>', 'b<sub>1C</sub>', 'b<sub>1N</sub>'],
  ['order / customer', 'a<sub>O</sub>', 'b<sub>2L</sub>', 'a<sub>C</sub>', 'b<sub>2N</sub>'],
  ['customer / name', 'b<sub>3O</sub>', 'b<sub>3L</sub>', 'a<sub>C</sub>', 'a<sub>N</sub>'],
];
const chase1 = chaseRows.map(r => [...r]); chase1[0][3] = 'a<sub>C</sub>';
const chase2 = chase1.map(r => [...r]); chase2[0][4] = chase2[1][4] = 'a<sub>N</sub>';
const adviceTable = rows => table('buyer_advice', ['customer', 'tea style', 'adviser'], rows);
const advisorTable = table('adviser styles · key: adviser', ['adviser', 'tea style'], [['A1', 'green'], ['A2', 'green']]);
const approvalTables = boxes([
  ['Supplier / product', project(offers,[0,1]).map(r => r.join(' / ')).join('<br>')],
  ['Supplier / region', project(offers,[0,2]).map(r => r.join(' / ')).join('<br>')],
  ['Product / region', project(offers,[1,2]).map(r => r.join(' / ')).join('<br>')],
]);
export const figures = {
  closure: {number:1, title:'Follow what the starting attributes determine', caption:'A worked closure calculation for a flattened order-line relation. The dependencies are declared rules; the boxes do not represent a query or a database execution.', cases:[closureCase(['order_id', 'line_no'], 'order and line'), closureCase(['order_id'], 'order only'), closureCase(['customer_id'], 'customer only')]},
  loss: {number:2, title:'Keeping every column can lose an association', caption:'Two orders belong to customer 1. The proposed split keeps both dates but forgets which order each belongs to. “Extra” marks a tuple that was absent from the original.', cases:[{label:'Join through the customer', stages:[
    scene(table('Original order facts', ['order','customer','placed_at · UTC'], [[101,1,'12 Oct 09:30'],[103,1,'20 Oct 10:15']]), 'Order 101 has the 12 October timestamp; order 103 has the 20 October timestamp.'),
    scene(boxes([['Order / customer', '101 / 1<br>103 / 1'], ['Customer / timestamp', '1 / 12 Oct 09:30<br>1 / 20 Oct 10:15']]), 'Both projections retain customer 1. That value does not determine either the order or its timestamp.'),
    scene(table('Reconstructed result', ['order','customer','placed_at · UTC','origin'], [[101,1,'12 Oct 09:30','original'],[101,1,'20 Oct 10:15','extra'],[103,1,'12 Oct 09:30','extra'],[103,1,'20 Oct 10:15','original']], [1,2]), 'Each order joins to both timestamps. Four rows reconstruct two originals: the forgotten association has become two extra claims.'),
  ]}]},
  chase: {number:3, title:'A chase proves reconstruction for all legal rows', caption:'The symbols stand for arbitrary values, not shop rows. Each a-symbol is the target value for that column; each b-symbol begins distinct. The highlighted complete row is the lossless-join witness.', cases:[{label:'Three projections', stages:[
    scene(table('Initial tableau',chaseHeaders,chaseRows), 'Use one row per projection. Put the target a-symbol in its columns and a fresh b-symbol in each missing position.'),
    scene(table('Apply order → customer',chaseHeaders,chase1,[0,1]), 'The first two rows agree on order aO. They must agree on customer. Replace b1C by aC everywhere.'),
    scene(table('Apply customer → name',chaseHeaders,chase2,[0]), 'All three rows now agree on customer aC. Merge their name symbols into aN. The first row is entirely a-symbols, so any tuple of the join must already be an original tuple.'),
  ]}]},
  advice: {number:4, title:'A lossless split moves a rule across tables', caption:'A1 is Iris Lin and A2 is Oren Moss. Both advise green tea. This is an independent assignment scenario; advisers are not customers. The final state is a counterexample to dependency preservation.', cases:[{label:'The BCNF split',stages:[
    scene(adviceTable(advice), 'Begin with a valid assignment: customer 1 has A1 for green tea; customer 2 has A2. Every adviser has one style and each customer has at most one adviser for a style.'),
    scene(advisorTable+arrow('split on adviser → style')+table('Assignments · key: (customer, adviser)',['customer','adviser'],[[1,'A1'],[2,'A2']]), 'The split removes the style from each assignment. It is lossless: the shared adviser determines the entire adviser/style side. Both resulting schemas are in BCNF under the projected FDs.'),
    scene(advisorTable+table('Locally valid assignments',['customer','adviser'],[[1,'A1'],[2,'A2'],[1,'A2']],[2])+arrow('join by adviser')+table('The join exposes the violation',['customer','tea style','adviser'],[[1,'green','A1'],[1,'green','A2']],[0,1]), 'Add customer 1 / A2. Neither local key is duplicated, yet customer 1 now has two advisers for green tea. The rule (customer, style) → adviser needs information from both tables.'),
  ]}]},
  synthesis: {number:5,title:'Build relations from a minimal cover',caption:'For this calculation O is order_id, L line_no, C customer_id, N customer_name, P product_id, Q quantity and U unit_price. These are abbreviations for the same flattened line facts.',cases:[{label:'3NF synthesis',stages:[
    scene(boxes([['Written dependencies','OL → PQU<br>O → C<br>OL → C<br>C → N<br>O → N']]), 'The written set contains repeated information. Split PQU into three single-attribute right sides before reducing it.'),
    scene(boxes([['Minimal cover','OL → P<br>OL → Q<br>OL → U<br>O → C<br>C → N'],['Removed','OL → C: L adds nothing<br>O → N: follows through C']]), 'L is extraneous in OL → C because O already reaches C. O → N is redundant because O → C and C → N still imply it. No remaining rule or left-side attribute can be removed.'),
    scene(boxes([['Group by determinant','OL → PQU<br>O → C<br>C → N'],['Create schemas','(O, L, P, Q, U)<br>(O, C)<br>(C, N)']]), 'Create one schema per determinant and its dependent attributes. Each minimal-cover rule is now local to a resulting relation.'),
    scene(boxes([['Line facts','(O, L, P, Q, U)<br>key: OL'],['Order / customer','(O, C)<br>key: O'],['Customer name','(C, N)<br>key: C']])+`<p class="nf-result">OL is a candidate key of the original and is contained in the first schema.</p>`, 'No schema is contained in another, and the line schema already contains an original candidate key. Nothing more is needed. This synthesis is in 3NF, preserves the FDs and has a lossless join.'),
  ]}]},
  mvd: {number:6,title:'Independence requires the missing corners',caption:'For product P7, every tag is independent of every supplier. The off-diagonal rows are required by the multivalued dependency. A table of specific tag–supplier associations would have a different rule.',cases:[{label:'Tuple swapping',stages:[
    scene(table('P7 · begin with two selected combinations',['Tag / supplier','S1','S2'],[['gift','selected','not shown'],['ceramic','not shown','selected']]), 'Take P7 / gift / S1 and P7 / ceramic / S2. They agree on product. Independence says that swapping their supplier parts must give rows too.'),
    scene(table('P7 · all four corners must exist',['Tag / supplier','S1','S2'],[['gift','selected','<strong class="nf-required">required</strong>'],['ceramic','<strong class="nf-required">required</strong>','selected']]), 'The two swapped rows are P7 / gift / S2 and P7 / ceramic / S1. All four combinations are required; the two new ones carry no further association.'),
    scene(boxes([['Tags for P7','gift<br>ceramic'],['Suppliers for P7','S1<br>S2']])+arrow('join on product recovers the four corners'), 'Keep product/tag and product/supplier memberships separately. Their join restores exactly the permitted combinations because that independence was declared.'),
  ]}]},
  jd: {number:7,title:'The same pairs under two different policies',caption:'Actual offers remain the original three tuples. The separate pairwise-approval policy permits exactly the join of its three approval relations. “Extra” and “eligible” describe the same fourth tuple under those different rules.',cases:[
    {label:'Actual offers',stages:[scene(table('Actual offers',['supplier','product','region'],offers), 'The shop has recorded three specific offers. S1 / P7 / South is absent. No rule makes every mutually compatible pair into an actual offer.'),scene(approvalTables, 'Project the three offers onto their three pairs. S1 / P7, S1 / South and P7 / South each survive, but their common triple was never offered.'),scene(table('Join of the three projections',['supplier','product','region','meaning'],pairwiseJoin(offers).map(r=>[...r,r.join('/')==='S1/P7/South'?'extra':'original']),[1]), 'The fourth tuple is extra. The displayed legal state disproves the proposed join dependency for actual offers; it must remain a three-way fact.')]},
    {label:'Pairwise-approval policy',stages:[scene(approvalTables, 'Change the policy explicitly: a triple is eligible if and only if all three pair approvals exist. These pairs are now the independently maintained facts.'),scene(table('Eligible offers · exactly the join',['supplier','product','region','meaning'],pairwiseJoin(offers).map(r=>[...r,'eligible']),[1]), 'The policy admits four triples, including S1 / P7 / South. This is intended eligibility, not an extra actual offer. The three projections now reconstruct the relation by definition.')]},
  ]},
};
