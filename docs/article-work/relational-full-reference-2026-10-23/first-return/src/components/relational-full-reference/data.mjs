// The article and its figures share these selected facts from example-facts.md.
export const customers = [[1, 'Mina Shah'], [2, 'Tariq Aziz'], [3, 'Edda Berg']];
export const products = [['P3', 'Green tea, 50 g', '4.50', 12], ['P7', 'Blue mug', '20.00', 1], ['P9', 'Teapot', '35.00', 4]];
export const orders = [[101, 1, 'paid'], [102, 2, 'paid'], [103, 1, 'pending']];
export const items = [[101, 1, 'P3', 1, '4.50'], [101, 2, 'P9', 1, '35.00'], [102, 1, 'P7', 2, '20.00'], [103, 1, 'P7', 1, '20.00'], [103, 2, 'P3', 2, '4.50']];
export const historyQuery = `SELECT o.order_id, o.status,
       i.line_no, p.name, i.quantity, i.unit_price
FROM orders AS o
JOIN order_items AS i ON i.order_id = o.order_id
JOIN products AS p ON p.product_id = i.product_id
WHERE o.customer_id = 1
ORDER BY o.order_id, i.line_no;`;
export const reserveQuery = `UPDATE products
SET stock = stock - 1
WHERE product_id = 'P7' AND stock >= 1
RETURNING stock;`;
export const race = {
  unsafe: [
    ['Not started', 'Not started', '1', 'Neither', 'Both buyers want the one remaining mug. Each request will read stock and later write the value it calculated.'],
    ['Read 1; plans to write 0', 'Not started', '1', 'Neither', 'Mina reads 1 and calculates 1 − 1 = 0 in application memory. Her read does not reserve the mug.'],
    ['Read 1; plans to write 0', 'Read 1; plans to write 0', '1', 'Neither', 'Tariq also reads 1 before Mina changes it. Both requests now believe they can accept an order.'],
    ['Writes 0; commits 103', 'Still plans to write 0', '0', '103', 'Mina writes the literal value 0 and commits order 103. Tariq’s earlier calculation has not changed.'],
    ['Committed 103', 'Writes 0; commits 104', '0', '103 and 104', 'Tariq writes 0 too and commits 104. Stock is non-negative, but two orders have taken one mug.']
  ],
  protected: [
    ['Not started', 'Not started', '1', 'Neither', 'Both requests use the conditional UPDATE inside a transaction. They create an order only after that change returns a row.'],
    ['Changes 1 → 0; holds row', 'Not started', '1 committed; 0 for Mina', 'Neither', 'Mina’s UPDATE finds stock ≥ 1 and subtracts one. The change is not committed yet; she holds the row’s write lock.'],
    ['Adds order 103 and lines', 'UPDATE waits for row', '1 committed; 0 for Mina', 'Neither', 'Tariq tries the same UPDATE. He waits for Mina’s transaction instead of acting on the earlier stock value.'],
    ['Commits 103; releases row', 'Rechecks stock ≥ 1', '0', '103', 'Mina commits the stock change, order and its lines together. Tariq resumes against the changed row.'],
    ['Committed 103', 'No row returned; rolls back', '0', '103', 'The condition is now false, so Tariq changes no row. His application rolls back and reports sold out; order 104 does not commit.']
  ]
};
