export const customers = [
 { tenant:10, id:1, name:'Mina Shah' },
 { tenant:10, id:2, name:'Tariq Aziz' },
 { tenant:10, id:3, name:'Edda Berg' },
 { tenant:20, id:4, name:'Rowan Vale' }
];
export const boundarySteps = [
 'The connection is shop_runtime. Its SELECT grant permits reading these customer columns. That grant alone does not choose a tenant.',
 'The service sends a query without a tenant condition. The request was authorised for tenant 10; the database context has also been set to 10.',
 'The database decides which candidate rows this connection may read. Compare the row for Rowan with the three tenant-10 rows.',
 'The result travels back to the service. A row policy can catch the missing SQL condition only while its tenant context is correct.'
];
export const contextSteps = [
 'A request authorised for tenant 10 borrows a connection. The service starts a transaction and sets tenant context to 10 before its first data query.',
 'The first request reads tenant 10’s customers. The policy compares each row’s tenant with context 10.',
 'The transaction ends and the connection returns to the pool. What happens to context now depends on its lifetime.',
 'A later request authorised for tenant 20 borrows the same connection, but a bug omits context setup. The database has not been told about that new request.',
 'Correct setup starts a new transaction and explicitly sets tenant context to 20. Only then does this request run its data query.'
];
