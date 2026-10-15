import { PGlite, protocol } from '@electric-sql/pglite';
import schema from '../../docs/article-work/designing-data/schema.sql?raw';

// One worker owns one disposable database and one PostgreSQL connection.
let db: PGlite;
const seed = `${schema}
CREATE TABLE stock (
  product_id text PRIMARY KEY REFERENCES products (product_id),
  available integer NOT NULL CHECK (available >= 0)
);
INSERT INTO stock (product_id, available) VALUES ('P7', 3);
SET statement_timeout = '10s';`;

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'init') {
      db = await PGlite.create();
      await db.exec(seed);
      self.postMessage({ type: 'ready' });
      return;
    }
    if (data.type !== 'run' || !db) return;
    // Read the actual protocol status, not a guess based on SQL text. This also
    // preserves earlier command results when a later statement returns an error.
    // Parse responses as they arrive so discarded rows are not retained in an
    // unbounded message array. This worker reads ReadyForQuery itself and uses
    // no PGlite transaction wrapper after initialization.
    const parser = new protocol.Parser();
    const outputs: { kind: string; fields?: string[]; rows?: (string | null)[][]; tag?: string; text?: string; code?: string; truncated?: boolean; cellsTruncated?: boolean }[] = [];
    let result: typeof outputs[number] | undefined;
    let status = '';
    let omitted = false;
    let displayCharacters = 0;
    let displayCells = 0;
    const displayLimit = 250000;
    await db.execProtocolRawStream(protocol.serialize.query(data.sql), { onRawData: bytes => parser.parse(bytes, raw => {
      const message = raw as typeof raw & { fields?: any[]; text?: string; status?: string; message?: string; code?: string; detail?: string; hint?: string };
      if (message.name === 'readyForQuery') { status = message.status!; return; }
      if (outputs.length >= 50 && message.name !== 'error') { omitted = true; return; }
      if (message.name === 'copyOutResponse') {
        outputs.push({ kind: 'notice', text: 'COPY output is not displayed by this editor. Use SELECT to inspect rows instead.' });
      } else if (message.name === 'rowDescription') {
        result = { kind: 'result', fields: message.fields!.slice(0, 40).map(field => field.name), truncated: message.fields!.length > 40, rows: [] };
      } else if (message.name === 'dataRow' && result) {
        if (result.rows!.length < 200 && displayCharacters < displayLimit && displayCells + Math.min(40, message.fields!.length) <= 5000) result.rows!.push(message.fields!.slice(0, 40).map(value => {
          displayCells++;
          if (value === null) return null;
          const text = String(value);
          const budget = Math.min(2000, Math.max(0, displayLimit - displayCharacters));
          displayCharacters += Math.min(text.length, budget);
          if (text.length > budget) { result!.cellsTruncated = true; return text.slice(0, budget) + '… [truncated]'; }
          return text;
        }));
        else result.truncated = true;
      } else if (message.name === 'commandComplete') {
        outputs.push({ ...(result || { kind: 'result' }), tag: message.text });
        result = undefined;
      } else if (message.name === 'error' || message.name === 'notice') {
        if (message.name === 'error' && outputs.length >= 50) { outputs.pop(); omitted = true; }
        outputs.push({ kind: message.name, text: [message.message, message.detail, message.hint].filter(Boolean).join('\n').slice(0, 4000), code: message.code });
        if (message.name === 'error') result = undefined;
      }
    }) });
    if (!['I', 'T', 'E'].includes(status)) throw new Error('This command needs an interactive protocol that this SQL editor does not support. Reset the database to continue.');
    self.postMessage({ type: 'result', id: data.id, outputs, status, omitted });
  } catch (error) {
    self.postMessage({ type: 'fatal', message: error instanceof Error ? error.message : 'The database stopped responding.' });
  }
};
