export const boundary = { at: '2026-10-20 10:15:00+00', id: 201 };
export const startingRows = [
  { id:202, at:'2026-10-20 10:15:00+00', short:'20 Oct · 10:15', status:'pending' },
  { id:201, at:'2026-10-20 10:15:00+00', short:'20 Oct · 10:15', status:'pending' },
  { id:103, at:'2026-10-20 10:15:00+00', short:'20 Oct · 10:15', status:'pending' },
  { id:102, at:'2026-10-14 16:05:00+00', short:'14 Oct · 16:05', status:'paid' },
  { id:101, at:'2026-10-12 09:30:00+00', short:'12 Oct · 09:30', status:'paid' },
];
export const mutations = {
  insert: { label:'Insert 203 before the boundary', change:'203 arrives at 21 Oct · 09:00.', rows:[{id:203,at:'2026-10-21 09:00:00+00',short:'21 Oct · 09:00',status:'pending'},...startingRows], offset:'The next query skips 203 and 202, then returns 201 and 103. Order 201 appears on both pages.', keyset:'203 is before the saved key. Continue after 201: return 103 and 102. The new order belongs to a refresh of the start.' },
  delete: { label:'Delete already-read 202', change:'202 is removed. The other ordering keys stay fixed.', rows:startingRows.filter(r=>r.id!==202), offset:'The next query skips 201 and 103, then returns 102 and 101. Order 103 is missed: it moved into the skipped positions.', keyset:'202 has gone, but the saved key has not moved. Continue after 201: return 103 and 102.' },
  forward: { label:'Move unread 103 before the boundary', change:'103’s time is corrected to 21 Oct · 08:00.', rows:[{...startingRows[2],at:'2026-10-21 08:00:00+00',short:'21 Oct · 08:00'},...startingRows.filter(r=>r.id!==103)], keyset:'103 is now before the saved key, so it fails the continuation test. Return 102 and 101. The traversal never shows 103.' },
  backward: { label:'Move already-read 202 after the boundary', change:'202’s time is corrected to 19 Oct · 12:00.', rows:[...startingRows.filter(r=>r.id!==202).slice(0,2),{...startingRows[0],at:'2026-10-19 12:00:00+00',short:'19 Oct · 12:00'},...startingRows.slice(3)], keyset:'202 is now after the saved key. Return 103 and 202. The traversal shows 202 again, under its changed ordering key.' },
};
export const isAfter = r => r.at < boundary.at || (r.at === boundary.at && r.id < boundary.id);
export const nextIds = (rows, mode) => (mode === 'offset' ? rows.slice(2,4) : rows.filter(isAfter).slice(0,2)).map(r=>r.id);
