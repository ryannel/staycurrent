import type { Frame } from './draw';

export type Params = Record<string, string>;

export type Param = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  initial: string;
};

export type Step<S> = { text: string; state: S };

export type Stat = { label: string; value: string };

export interface Scene<S = any> {
  id: string;
  params?: Param[];
  steps(params: Params): Step<S>[];
  render(state: S, width: number, params: Params): Frame;
  stats?(state: S, params: Params): Stat[];
  /** Milliseconds between steps while playing. */
  interval?(params: Params): number;
  /** After a parameter changes: jump to the last step, or replay from the start. */
  onParam?: 'end' | 'play';
}

export const defaults = (scene: Scene): Params =>
  Object.fromEntries((scene.params ?? []).map(param => [param.id, param.initial]));
