/*
 * <storage-figure data-scene="…"> drives one animated figure: it builds the
 * scene's steps, draws the current step, and wires play/pause, back/next, the
 * step scrubber, reset and any scene parameters.
 *
 * With motion allowed, a figure plays once when half of it scrolls into view,
 * and holds each step long enough to read. With reduced motion it rests on
 * the last step and never plays by itself. It pauses when it leaves the view.
 */
import { scenes } from './index';
import { reconcile } from './draw';
import { defaults, holdFor, type Params, type Scene, type Step } from './types';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class StorageFigure extends HTMLElement {
  private scene!: Scene;
  private params: Params = {};
  private steps: Step<unknown>[] = [];
  private index = 0;
  private playing = false;
  private timer = 0;
  private width = 0;
  private autoplayed = false;
  private resumeOnReturn = false;
  private svg!: SVGSVGElement;
  private layer!: SVGGElement;
  private stage!: HTMLElement;
  private stepText!: HTMLElement;
  private stats!: HTMLElement;
  private count!: HTMLElement;
  private range!: HTMLInputElement;
  private playButton!: HTMLButtonElement;

  connectedCallback() {
    if (this.dataset.ready) return;
    const scene = scenes[this.dataset.scene ?? ''];
    if (!scene) return;
    this.scene = scene;
    this.params = defaults(scene);
    this.steps = scene.steps(this.params);
    this.svg = this.querySelector('svg.sf-svg')!;
    this.layer = this.querySelector('g.sf-layer')!;
    this.stage = this.querySelector('.sf-stage')!;
    this.stepText = this.querySelector('.sf-step')!;
    this.stats = this.querySelector('.sf-stats')!;
    this.count = this.querySelector('.sf-count')!;
    this.range = this.querySelector('input.sf-scrub')!;
    this.playButton = this.querySelector('button[data-act="play"]')!;

    this.querySelector('.sf-transport')!.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-act]');
      if (!button) return;
      const act = button.dataset.act;
      this.resumeOnReturn = false;
      if (act === 'play') return this.playing ? this.pause() : this.play();
      this.pause();
      if (act === 'reset') this.go(0, false);
      if (act === 'back') this.go(this.index - 1, true);
      if (act === 'next') this.go(this.index + 1, true);
    });
    this.range.addEventListener('input', () => {
      this.resumeOnReturn = false;
      this.pause();
      this.go(Number(this.range.value), true);
    });
    this.querySelectorAll<HTMLButtonElement>('button[data-param]').forEach(button => {
      button.addEventListener('click', () => this.setParam(button.dataset.param!, button.dataset.value!));
    });

    new ResizeObserver(() => {
      const width = Math.round(this.stage.clientWidth);
      if (width && width !== this.width) {
        this.width = width;
        this.draw(false);
      }
    }).observe(this.stage);
    new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          if (this.playing) {
            this.pause();
            this.resumeOnReturn = true;
          }
        } else if (entry.intersectionRatio >= 0.5 && !reducedMotion()) {
          if (!this.autoplayed) {
            this.autoplayed = true;
            this.go(0, false);
            this.play();
          } else if (this.resumeOnReturn) {
            this.resumeOnReturn = false;
            this.play();
          }
        }
      }
    }, { threshold: [0, 0.5] }).observe(this.stage);

    this.dataset.ready = '1';
    this.width = Math.round(this.stage.clientWidth) || 320;
    this.range.max = String(this.steps.length - 1);
    this.index = reducedMotion() ? this.steps.length - 1 : 0;
    this.draw(false);
  }

  private setParam(id: string, value: string) {
    this.pause();
    this.resumeOnReturn = false;
    this.autoplayed = true;
    this.params = { ...this.params, [id]: value };
    this.querySelectorAll<HTMLButtonElement>(`button[data-param="${id}"]`).forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.value === value));
    });
    this.steps = this.scene.steps(this.params);
    this.range.max = String(this.steps.length - 1);
    if (this.scene.onParam === 'end' || reducedMotion()) {
      this.go(this.steps.length - 1, false);
    } else {
      this.go(0, false);
      this.play();
    }
  }

  private go(index: number, animate: boolean) {
    this.index = Math.max(0, Math.min(this.steps.length - 1, index));
    this.draw(animate);
  }

  private play() {
    if (this.index >= this.steps.length - 1) this.go(0, false);
    this.playing = true;
    this.updatePlayButton();
    this.stepText.setAttribute('aria-live', 'off');
    this.schedule();
  }

  private pause() {
    window.clearTimeout(this.timer);
    if (!this.playing) return;
    this.playing = false;
    this.updatePlayButton();
    this.stepText.setAttribute('aria-live', 'polite');
  }

  private schedule() {
    const delay = holdFor(this.steps[this.index], this.scene.interval?.(this.params) ?? 420);
    this.timer = window.setTimeout(() => {
      if (!this.playing) return;
      if (this.index < this.steps.length - 1) {
        this.go(this.index + 1, true);
        if (this.index < this.steps.length - 1) this.schedule();
        else this.pause();
      } else this.pause();
    }, delay);
  }

  private updatePlayButton() {
    this.playButton.dataset.state = this.playing ? 'playing' : 'paused';
    const label = this.playButton.querySelector('.sf-btn-label');
    if (label) label.textContent = this.playing ? 'Pause' : 'Play';
  }

  private draw(animate: boolean) {
    const step = this.steps[this.index];
    const width = this.width || 320;
    const frame = this.scene.render(step.state, width, this.params);
    this.svg.setAttribute('viewBox', `0 0 ${width} ${frame.height}`);
    this.svg.setAttribute('width', String(width));
    this.svg.setAttribute('height', String(frame.height));
    const instant = !animate || reducedMotion();
    if (instant) this.svg.classList.add('sf-instant');
    reconcile(this.layer, frame.items);
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => this.svg.classList.remove('sf-instant')));

    this.stepText.textContent = step.text;
    const total = this.steps.length;
    this.count.textContent = `${this.index + 1} / ${total}`;
    this.range.value = String(this.index);
    this.range.setAttribute('aria-valuetext', `Step ${this.index + 1} of ${total}`);
    const stats = this.scene.stats?.(step.state, this.params) ?? [];
    this.stats.innerHTML = '';
    for (const stat of stats) {
      const item = document.createElement('div');
      const value = document.createElement('dd');
      const label = document.createElement('dt');
      value.textContent = stat.value;
      label.textContent = stat.label;
      item.append(label, value);
      this.stats.append(item);
    }
    this.querySelector('button[data-act="back"]')!.setAttribute('aria-disabled', String(this.index === 0));
    this.querySelector('button[data-act="next"]')!.setAttribute('aria-disabled', String(this.index === total - 1));
  }
}

if (!customElements.get('storage-figure')) customElements.define('storage-figure', StorageFigure);
