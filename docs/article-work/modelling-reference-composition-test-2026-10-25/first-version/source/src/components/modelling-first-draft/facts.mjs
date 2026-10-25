export const products = [
  { id: 'P3', name: 'Green tea, 50 g', price: '4.50' },
  { id: 'P7', name: 'Blue mug', price: '20.00' },
  { id: 'P9', name: 'Teapot', price: '35.00' },
];
export const lines = [
  {order:101, line:1, product:'P3', quantity:1, price:'4.50'},
  {order:101, line:2, product:'P9', quantity:1, price:'35.00'},
  {order:103, line:1, product:'P7', quantity:1, price:'20.00'},
  {order:103, line:2, product:'P3', quantity:2, price:'4.50'},
];
export const payments = [{id:501, amount:'30.00', method:'card'},{id:502, amount:'9.50', method:'gift card'}];
export const offers = [['S1','P7','North'],['S1','P3','South'],['S2','P7','South']];
export const tags = ['gift','ceramic'];
export const suppliers = ['S1','S2'];
