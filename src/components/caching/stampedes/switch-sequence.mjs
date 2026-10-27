// A stepped sequence whose steps change with a <Choice> in the figure. The shared
// sequenceFigure() takes one fixed spec but reads that object on every draw, so
// swapping the object's contents and resetting the stepper redraws the chosen
// sequence from its start. A local copy of the extension the caching-patterns
// and invalidation articles also carry; reported as a toolkit gap.
import { sequenceFigure } from '../shared/sequence.mjs';

/** specs: { [optionValue]: spec }, each with an `intro`. name: the Choice's name. */
export function switchSequence(root, specs, name) {
  const checked = () => root.querySelector(`[data-param="${name}"]:checked`)?.value ?? Object.keys(specs)[0];
  const spec = { ...specs[checked()] };
  const player = sequenceFigure(root, spec);
  root.querySelectorAll(`[data-param="${name}"]`).forEach(input => input.addEventListener('change', () => {
    for (const key of Object.keys(spec)) delete spec[key];
    Object.assign(spec, specs[checked()]);
    root.querySelector('[data-reset]')?.click();
  }));
  return player;
}
