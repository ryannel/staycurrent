export const customers = [{id:1,name:'Mina Shah'}, {id:2,name:'Tariq Aziz'}, {id:3,name:'Edda Berg'}];
export const orders = [{id:101,customer:1,status:'paid'}, {id:102,customer:2,status:'paid'}, {id:103,customer:1,status:'pending'}];
export const items = [{order:101,line:1,product:'P3',quantity:1,price:450}, {order:101,line:2,product:'P9',quantity:1,price:3500}, {order:102,line:1,product:'P7',quantity:2,price:2000}, {order:103,line:1,product:'P7',quantity:1,price:2000}, {order:103,line:2,product:'P3',quantity:2,price:450}];
export const payments = [{id:501,order:101,amount:3000,method:'card'}, {id:502,order:101,amount:950,method:'gift card'}, {id:503,order:102,amount:4000,method:'card'}];
export const money = cents => (cents / 100).toFixed(2);
export const lineValue = item => item.quantity * item.price;
export const linesFor = order => items.filter(i => i.order === order);
export const paymentsFor = order => payments.filter(p => p.order === order);
export const balances = (extra = []) => orders.map(o => {
  const value = linesFor(o.id).reduce((s,i) => s + lineValue(i),0);
  const paid = [...payments,...extra].filter(p => p.order === o.id).reduce((s,p) => s+p.amount,0);
  return {...o,value,paid,due:value-paid};
});
export const raw101 = linesFor(101).flatMap(i => paymentsFor(101).map(p => ({line:i.line,payment:p.id,value:lineValue(i),paid:p.amount})));
