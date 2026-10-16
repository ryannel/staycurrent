// The running model for the Indexes article: an invented orders table of
// 36 rows on six heap pages, six rows to a page. Every figure on the page
// draws from these same rows, so a reader can follow customer 42 throughout.

export interface Order {
  id: number;        // order_id, also the order in which rows were inserted
  customer: number;  // customer_id
  day: number;       // days since 31 December; 1 = 1 Jan, 32 = 1 Feb
  total: number;     // order total in euros
  page: number;      // heap page, numbered from 0 as PostgreSQL does
  slot: number;      // line pointer on the page, numbered from 1
}

// Customer IDs in insertion order. Customer 42's four orders land on
// pages 0, 1, 3 and 5, as rows naturally scatter in a heap.
const heapCustomers = [
  11, 60, 42, 5, 27, 71,
  34, 16, 79, 53, 42, 20,
  23, 66, 5, 47, 11, 31,
  60, 27, 42, 64, 16, 79,
  53, 5, 20, 66, 34, 23,
  47, 11, 71, 27, 60, 42,
];

export const PAGE_ROWS = 6;
export const PAGES = 6;

export const orders: Order[] = heapCustomers.map((customer, i) => ({
  id: i + 1,
  customer,
  day: i + 1,
  total: 12 + ((i * 17) % 47),
  page: Math.floor(i / PAGE_ROWS),
  slot: (i % PAGE_ROWS) + 1,
}));

export const ctid = (o: Order) => `(${o.page},${o.slot})`;
export const dayLabel = (day: number) => (day <= 31 ? `${day} Jan` : `${day - 31} Feb`);

// PostgreSQL B-trees break ties between equal keys with the heap location.
export const byCustomer = (a: Order, b: Order) => a.customer - b.customer || a.page - b.page || a.slot - b.slot;
export const byCustomerDateDesc = (a: Order, b: Order) => a.customer - b.customer || b.day - a.day;
export const byDateDescCustomer = (a: Order, b: Order) => b.day - a.day || a.customer - b.customer;

export const customerIndex = [...orders].sort(byCustomer);
export const customers = [...new Set(customerIndex.map((o) => o.customer))];

// Leaf pages hold six entries each; two branch pages and one root sit above.
export const leaves = (entries: Order[]) =>
  Array.from({ length: entries.length / PAGE_ROWS }, (_, i) => entries.slice(i * PAGE_ROWS, (i + 1) * PAGE_ROWS));

export interface TreeSlot { label: string; low: number; high: number; child: number }
export const root: TreeSlot[] = [
  { label: '< 42', low: -Infinity, high: 42, child: 0 },
  { label: '≥ 42', low: 42, high: Infinity, child: 1 },
];
export const branches: TreeSlot[][] = [
  [
    { label: '< 16', low: -Infinity, high: 16, child: 0 },
    { label: '16–26', low: 16, high: 27, child: 1 },
    { label: '≥ 27', low: 27, high: 42, child: 2 },
  ],
  [
    { label: '< 53', low: 42, high: 53, child: 3 },
    { label: '53–65', low: 53, high: 66, child: 4 },
    { label: '≥ 66', low: 66, high: Infinity, child: 5 },
  ],
];

export const slotFor = (slots: TreeSlot[], key: number) => slots.find((s) => key >= s.low && key < s.high)!;
