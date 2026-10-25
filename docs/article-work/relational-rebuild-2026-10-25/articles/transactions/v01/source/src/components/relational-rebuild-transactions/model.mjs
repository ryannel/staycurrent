const frame = (left, right, state, explanation, paid = null) => ({left, right, state, explanation, paid});
export const figures = {
  purchase: {
    number: 1, title: 'What crosses the commit boundary',
    prompt: 'Purchase outcome',
    caption: 'Replay before order 103 exists: P7 stock 1, P3 stock 12. The right panel shows the committed facts available to a new ordinary reader. P9 stays at 4 throughout.',
    variants: {
      commit: { label:'Commit the purchase', leftTitle:'Purchase 103 · own work', rightTitle:'Committed database', steps:[
        frame(['BEGIN','No changes yet'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines'], 'Nothing allocated yet', 'The transaction starts before order 103 exists. Its work will cross one commit boundary.'),
        frame(['P7 stock 0 · uncommitted','Mug allocation succeeded'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines'], 'Mug changed inside the transaction', 'The transaction sees its own stock change. Another ordinary reader still sees the earlier committed mug stock.'),
        frame(['P7 stock 0 · P3 stock 10','Order 103 · pending','Line 1: P7 × 1 at 20.00','Line 2: P3 × 2 at 4.50'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines'], 'All purchase work is still uncommitted', 'Both allocations and the order with its two lines are ready. None of this transaction’s changes is committed yet.'),
        frame(['COMMIT','One accepted purchase'], ['P7 stock 0 · P3 stock 10','Order 103 · pending','Two lines · value 29.00','No payment'], 'Commit makes the whole purchase eligible to read', 'A new snapshot after commit includes both stock changes and the complete order. It has no payment, so it stays pending.')
      ]},
      rollback: { label:'Roll back after the mug', leftTitle:'Purchase 103 · own work', rightTitle:'Committed database', steps:[
        frame(['BEGIN','No changes yet'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines'], 'Nothing allocated yet', 'Start from the same facts, this time with an application failure after the mug allocation.'),
        frame(['P7 stock 0 · uncommitted','Mug allocation succeeded'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines'], 'The mug change is provisional', 'The first allocation succeeded. It has not committed independently of the rest of the purchase.'),
        frame(['Application cannot finish','ROLLBACK'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines'], 'Rollback abandons the mug change', 'The application rolls back rather than keeping a partial purchase. The earlier stock change is abandoned too.'),
        frame(['Transaction ended','No purchase accepted'], ['P7 stock 1 · P3 stock 12','No order 103 or its lines','No payment'], 'Starting facts remain', 'There is no new order and no allocation. A later request must make its own decision against the available stock.')
      ]}
    }
  },
  stock: {
    number:2, title:'Two earlier reads, two different outcomes', prompt:'Stock operation',
    caption:'Separate Read Committed transactions. Only their mug operations are drawn. Mina changes P7 first and commits; a failed allocation makes Tariq’s application roll back the whole losing purchase.',
    variants: {
      unsafe: {label:'Write the earlier calculation', leftTitle:'Mina · purchase 103',rightTitle:'Tariq · purchase 104',steps:[
        frame(['1 · Read stock: 1'],['Not read yet'],'Committed P7 stock: 1','Mina reads one mug and calculates a new stock of zero in application code.'),
        frame(['1 · Read stock: 1'],['2 · Read stock: 1'],'Committed P7 stock: 1','Tariq also reads one mug before Mina’s write. His application calculates zero too.'),
        frame(['1 · Read stock: 1','3 · SET stock = 0'],['2 · Read stock: 1','4 · SET stock = 0 · waits'],'Committed P7 stock: 1','Mina changes P7. Tariq’s write to that same row waits for her transaction to end.'),
        frame(['1 · Read stock: 1','3 · SET stock = 0','5 · COMMIT'],['2 · Read stock: 1','4 · SET stock = 0 · resumes'],'Committed P7 stock: 0','After Mina commits, Tariq writes zero over zero. There is no availability condition to fail.'),
        frame(['Purchase 103 accepted'],['Purchase 104 accepted'],'P7 stock: 0 · two purchases accepted','Both purchases can commit. The stock check remains non-negative, but it did not stop two allocations of the last mug.')
      ]},
      guarded: {label:'Check and subtract together', leftTitle:'Mina · purchase 103',rightTitle:'Tariq · purchase 104',steps:[
        frame(['1 · Earlier stock read: 1'],['Not read yet'],'Committed P7 stock: 1','An earlier display may tell Mina there is one mug. The later guarded update must authorise her allocation.'),
        frame(['1 · Earlier stock read: 1'],['2 · Earlier stock read: 1'],'Committed P7 stock: 1','Tariq sees the same starting stock. Neither earlier read reserves it.'),
        frame(['3 · stock ≥ 1 → subtract 1','Returns P7 stock 0'],['4 · Guarded update · waits'],'Committed P7 stock: 1','Mina’s guard succeeds and changes P7. Tariq waits on her update of that row.'),
        frame(['5 · COMMIT','Purchase 103 accepted'],['Guard rechecked on stock 0','No row changed or returned'],'Committed P7 stock: 0','Once Mina commits, Tariq’s guard is tested against the changed row. Zero is not at least one.'),
        frame(['Purchase 103 accepted'],['ROLLBACK purchase 104','Earlier changes abandoned'],'P7 stock: 0 · only purchase 103 accepted','The database did not raise an error for zero changed rows. Tariq’s application treats that result as a failed purchase and rolls it all back.')
      ]}
    }
  },
  snapshots: {
    number:3, title:'Two reads across one commit', prompt:'Report isolation',
    caption:'A read-only report begins before Mina’s purchase. The panels show what each transaction does; the strip below shows the committed database. Switch isolation and replay the same order of events.',
    variants: {
      committed: {label:'Read Committed',leftTitle:'Report · statement snapshots',rightTitle:'Mina · purchase 103',steps:[
        frame(['BEGIN','No query yet'],['Purchase not started'],'Committed: stock 1 · order 103 absent','The report starts a transaction. No query has observed any shop facts yet.'),
        frame(['Query 1 → P7 stock 1','Snapshot before purchase'],['Purchase not started'],'Committed: stock 1 · order 103 absent','The first SELECT gets a statement snapshot before Mina’s purchase.'),
        frame(['Saved answer: stock 1'],['Allocate mug and tea','Insert order and two lines','Still uncommitted'],'Committed: stock 1 · order 103 absent','Mina’s work is provisional. The report cannot read the uncommitted purchase.'),
        frame(['Saved answer: stock 1'],['COMMIT complete purchase'],'Committed: stock 0 · order 103 exists','Mina commits both stock changes and the complete order together. The first answer already stored by the report does not change.'),
        frame(['Query 1 saved: stock 1','Query 2 → order 103 exists','New statement snapshot'],['Purchase committed'],'Committed: stock 0 · order 103 exists','The second SELECT sees Mina’s commit. Combining its answer with stock 1 mixes observations from different moments.'),
        frame(['Query 3 → P7 stock 0','Repeated read has changed'],['Purchase committed'],'Committed: stock 0 · order 103 exists','A third SELECT of the same mug now returns zero. This is a nonrepeatable read.')
      ]},
      repeatable: {label:'Repeatable Read',leftTitle:'Report · one transaction snapshot',rightTitle:'Mina · purchase 103',steps:[
        frame(['BEGIN','Snapshot not established yet'],['Purchase not started'],'Committed: stock 1 · order 103 absent','BEGIN alone does not fix the PostgreSQL Repeatable Read snapshot.'),
        frame(['Query 1 → P7 stock 1','Transaction snapshot fixed here'],['Purchase not started'],'Committed: stock 1 · order 103 absent','This first query establishes the report’s snapshot before Mina’s purchase.'),
        frame(['Keep the first snapshot'],['Allocate mug and tea','Insert order and two lines','Still uncommitted'],'Committed: stock 1 · order 103 absent','The report keeps its view. It does not read Mina’s unfinished changes.'),
        frame(['Keep the first snapshot'],['COMMIT complete purchase'],'Committed: stock 0 · order 103 exists','Mina commits. The committed database has changed, but the report’s transaction snapshot stays where its first query put it.'),
        frame(['Query 1: stock 1','Query 2 → no order 103','Same transaction snapshot'],['Purchase committed'],'Committed: stock 0 · order 103 exists','The second query sees the earlier absence of order 103. Both answers describe the view before the purchase.'),
        frame(['Query 3 → P7 stock 1','Repeated read stays the same'],['Purchase committed'],'Committed: stock 0 · order 103 exists','The report still reads one mug. It must end and begin new work to obtain a fresh transaction snapshot.')
      ]}
    }
  },
  payments: {
    number:4, title:'Two payments against a limit of 29.00',prompt:'Payment isolation',
    caption:'Independent scenario: order 103 already exists, its line value stays 29.00 and it has no payments. Requests A and B each propose 20.00 in distinct rows, 601 and 602. An inserted row is not counted as committed until its transaction commits.',
    variants: {
      repeatable: {label:'Repeatable Read',leftTitle:'Request A · payment 601',rightTitle:'Request B · payment 602',steps:[
        frame(['Read paid: 0','0 + 20.00 ≤ 29.00 → allow'],['Not read yet'],'Two independent decisions', 'A’s snapshot has no payments. A decides that its 20.00 fits.',0),
        frame(['Read paid: 0','Decision: allow 20.00'],['Read paid: 0','0 + 20.00 ≤ 29.00 → allow'],'Both reads precede either commit','B also reads no payments. Its stable snapshot does not include A’s future payment.',0),
        frame(['Insert 601: 20.00','Uncommitted'],['Decision: allow 20.00'],'First new row is provisional','A inserts payment 601. It changes no row that B is trying to update.',0),
        frame(['Insert 601: 20.00','Uncommitted'],['Insert 602: 20.00','Uncommitted'],'Different payment rows','B inserts 602 with a different key. Each positive row satisfies its row constraints.',0),
        frame(['COMMIT 601: 20.00'],['602 still uncommitted'],'A has committed','Only A’s payment is committed so far.',20),
        frame(['COMMIT 601: 20.00'],['COMMIT 602: 20.00'],'40.00 paid exceeds the 29.00 line value','B can commit too. Stable snapshots did not prevent the combined payments from breaking the rule.',40)
      ]},
      serializable: {label:'Serializable',leftTitle:'Request A · payment 601',rightTitle:'Request B · payment 602',steps:[
        frame(['Read paid: 0','0 + 20.00 ≤ 29.00 → allow'],['Not read yet'],'Decisions run inside Serializable work','A reads no payments and tentatively allows its 20.00.',0),
        frame(['Read paid: 0','Decision: allow 20.00'],['Read paid: 0','0 + 20.00 ≤ 29.00 → allow'],'Both reads precede either commit','B reads the same absence. Serializable does not require it to wait before reading.',0),
        frame(['Insert 601: 20.00','Uncommitted'],['Decision: allow 20.00'],'First new row is provisional','A’s insert is still provisional. Its result is not accepted until commit succeeds.',0),
        frame(['601 still provisional'],['Try to keep payment 602'],'Conflict: no serial order permits both','Both decisions relied on the absence of the other payment. The two payments cannot both survive.',0),
        frame(['COMMIT 601: 20.00'],['Attempt aborted · 40001','No committed payment 602'],'One possible outcome: A commits','This illustration chooses A as the winner. PostgreSQL may report B’s serialization failure during a statement or at commit.',20),
        frame(['601 committed: 20.00'],['New whole transaction','Read paid: 20.00','20.00 + 20.00 > 29.00','ROLLBACK · refuse payment'],'Fresh decision refuses the second 20.00','B retries the reads and decision, not just its old insert. Its new view contains A’s payment, leaving only 9.00 available.',20)
      ]}
    }
  }
};
