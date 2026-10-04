import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationState } from './object-publication.mjs';
test('overwriting two keys exposes a mixed export between writes', () => {
  assert.equal(publicationState('overwrite', 0).coherent, true);
  assert.equal(publicationState('overwrite', 1).coherent, false);
  assert.equal(publicationState('overwrite', 2).coherent, true);
});
test('publishing a manifest never exposes an incomplete generation', () => {
  for (let step=0; step<=3; step++) {
    const state=publicationState('manifest', step);
    assert.equal(state.coherent, true);
    assert.equal(state.priceGeneration, step<3?'A':'B');
    assert.equal(state.stockGeneration, state.priceGeneration);
  }
  assert.equal(publicationState('manifest', 2).uploaded, 2);
  assert.equal(publicationState('manifest', 2).pointer, 'A');
  assert.equal(publicationState('manifest', 3).pointer, 'B');
});
test('both strategies end with the same business data', () => {
  const a=publicationState('overwrite',3), b=publicationState('manifest',3);
  assert.equal(a.price,b.price); assert.equal(a.stock,b.stock);
});
