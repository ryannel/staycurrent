// Teaching application code using a node-postgres-shaped client.
// isKnownTransactionRejection must confirm the attempt did not commit (for example 40001/40P01).
export async function checkoutAttempt(pool, purchase, isKnownTransactionRejection) {
  const client = await pool.connect();
  let commitSent = false;
  let reusable = false;
  try {
    await client.query('BEGIN');
    const reservation = await client.query(
      `UPDATE stock SET available = available - $1
       WHERE product_id = $2 AND available >= $1
       RETURNING available`,
      [purchase.quantity, purchase.productId]
    );
    if (reservation.rows.length === 0) {
      await client.query('ROLLBACK');
      reusable = true;
      return { status: 'unavailable' };
    }
    await client.query(
      `INSERT INTO orders (order_id, customer_id, placed_at)
       VALUES ($1, $2, $3)`,
      [purchase.orderId, purchase.customerId, purchase.placedAt]
    );
    await client.query(
      `INSERT INTO order_lines
         (order_id, line_no, product_id, quantity, unit_price)
       VALUES ($1, 1, $2, $3, $4)`,
      [purchase.orderId, purchase.productId,
       purchase.quantity, purchase.unitPrice]
    );
    commitSent = true;
    await client.query('COMMIT');
    reusable = true;
    return { status: 'purchased', orderId: purchase.orderId };
  } catch (error) {
    if (commitSent && !isKnownTransactionRejection(error)) {
      const unknown = new Error('Commit outcome unknown', { cause: error });
      unknown.outcome = 'unknown';
      throw unknown;
    }
    try {
      await client.query('ROLLBACK');
      reusable = true;
    } catch {
      // Cleanup failed. Keep reusable false: discard this connection.
    }
    throw error;
  } finally {
    client.release(!reusable); // true tells the pool to discard it
  }
}
