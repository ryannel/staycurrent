// Test bench model: one Redis main thread working through commands in arrival
// order, in microseconds. GETs arrive at random; an action adds a slow command.
import { Simulation, poissonArrivals } from '../sim.mjs';

export function eventLoop({ rate = 50000, cost = 8, slow = 300 } = {}, seed = 1) {
  const sim = new Simulation({ seed });
  const queue = [];
  const model = { sim, queue, blocks: [], spans: [], running: null, done: 0, longestWait: 0, rate, slow };
  const startNext = () => {
    model.running = null;
    if (!queue.length) return;
    const job = queue.shift();
    const start = sim.now;
    if (start > job.arrived) model.blocks.push({ lane: 'clients', start: job.arrived, end: start, kind: 'client', thin: true });
    model.longestWait = Math.max(model.longestWait, start - job.arrived);
    const block = { lane: 'main', start, end: start + job.cost, kind: job.kind, label: job.label };
    model.blocks.push(block);
    if (job.cost >= 100) model.spans.push({ start, end: start + job.cost, label: 'one slow command', kind: 'error' });
    model.running = block;
    sim.after(job.cost, () => { model.done++; startNext(); });
  };
  model.submit = job => {
    queue.push({ ...job, arrived: sim.now });
    // Forget what has scrolled well out of view.
    const old = sim.now - 5000;
    if (model.blocks.length > 400) model.blocks = model.blocks.filter(b => b.end >= old);
    if (!model.running) startNext();
  };
  model.runSlow = () => model.submit({ cost: model.slow, kind: 'error', label: 'KEYS *' });
  poissonArrivals(sim, () => model.rate, () => model.submit({ cost, kind: 'redis', label: 'GET' }), { unitsPerSecond: 1e6 });
  return model;
}
