import type { Frame } from './draw';

export type Params = Record<string, string>;

export type Param = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  initial: string;
  /** Buttons by default. A slider suits one quantity with ordered values. */
  kind?: 'buttons' | 'slider';
};

/**
 * One step of a figure. While playing, a step is held long enough to read its
 * text. A `fast` step is one of a run of near-identical steps with short text
 * (a row being added, a record being logged); it uses the scene's interval.
 */
export type Step<S> = { text: string; state: S; fast?: boolean; hold?: number };

export type Stat = { label: string; value: string };

export interface Scene<S = any> {
  id: string;
  params?: Param[];
  steps(params: Params): Step<S>[];
  render(state: S, width: number, params: Params): Frame;
  stats?(state: S, params: Params): Stat[];
  /** Milliseconds between `fast` steps while playing. */
  interval?(params: Params): number;
  /** A shorter text alternative than one line per step, for scenes with many steps. */
  outline?(params: Params): string[];
  /** After a parameter changes: jump to the last step, or replay from the start. */
  onParam?: 'end' | 'play';
}

export const defaults = (scene: Scene): Params =>
  Object.fromEntries((scene.params ?? []).map(param => [param.id, param.initial]));

/** How long to hold a step while playing, so the narration can be read. */
export const holdFor = (step: Step<unknown>, fastInterval: number): number =>
  step.fast ? fastInterval : Math.max(step.hold ?? 1900, 900 + step.text.length * 45);
