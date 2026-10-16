// Shared behaviour for the Indexes figures: a sequence of frames with
// play/pause, step back, step forward and reset, a status line that says what
// each frame shows, and a layout that switches between wide and narrow.

export interface Frame {
  note: string;      // a sentence describing this moment, read by the status line
  hold?: number;     // milliseconds to stay on this frame while playing
}

export type Layout = 'wide' | 'narrow';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export abstract class IndexFigure<F extends Frame> extends HTMLElement {
  protected frames: F[] = [];
  protected cursor = 0;
  protected layout: Layout = 'wide';
  private timer = 0;
  private playing = false;
  private autoplayed = false;
  private playButton!: HTMLButtonElement;
  private backButton!: HTMLButtonElement;
  private nextButton!: HTMLButtonElement;
  private stepLabel!: HTMLElement;
  private status!: HTMLElement;
  protected stage!: HTMLElement;

  /** Wide layouts need at least this many pixels of stage width. */
  protected wideAt = 600;

  protected abstract build(): F[];
  protected abstract draw(layout: Layout): void;
  protected abstract render(frame: F, index: number): void;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = 'true';
    this.stage = this.querySelector('[data-stage]')!;
    this.playButton = this.querySelector('[data-play]')!;
    this.backButton = this.querySelector('[data-back]')!;
    this.nextButton = this.querySelector('[data-next]')!;
    this.stepLabel = this.querySelector('[data-step]')!;
    this.status = this.querySelector('[data-status]')!;
    this.playButton.addEventListener('click', () => (this.playing ? this.pause() : this.play()));
    this.backButton.addEventListener('click', () => { this.pause(); this.go(this.cursor - 1); });
    this.nextButton.addEventListener('click', () => { this.pause(); this.go(this.cursor + 1); });
    this.querySelector('[data-reset]')!.addEventListener('click', () => { this.pause(); this.go(0); });
    this.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-param]').forEach((input) =>
      input.addEventListener('change', () => this.rebuild(true)));
    this.addEventListener('keydown', (event) => {
      if ((event.target as HTMLElement).matches('input, select')) return;
      if (event.key === 'ArrowRight') { this.pause(); this.go(this.cursor + 1); event.preventDefault(); }
      if (event.key === 'ArrowLeft') { this.pause(); this.go(this.cursor - 1); event.preventDefault(); }
    });
    this.setup();
    this.layout = this.measure();
    this.rebuild(false);
    new ResizeObserver(() => {
      const next = this.measure();
      if (next !== this.layout) { this.layout = next; this.draw(next); this.render(this.frames[this.cursor], this.cursor); }
    }).observe(this.stage);
    if (!reducedMotion()) {
      new IntersectionObserver((entries, observer) => {
        const seen = entries.some((e) => e.isIntersecting && (e.intersectionRatio >= 0.6 || e.intersectionRect.height >= window.innerHeight * 0.45));
        if (seen && !this.autoplayed) {
          this.autoplayed = true;
          observer.disconnect();
          window.setTimeout(() => this.play(), 400);
        }
      }, { threshold: [0.2, 0.4, 0.6] }).observe(this.stage);
    }
  }

  /** Called once before the first build, for figures that need extra wiring. */
  protected setup() {}

  /** Update the counter row above the drawing: [label, value, emphasis?]. */
  protected counters(items: [string, string | number, boolean?][]) {
    const host = this.querySelector<HTMLElement>('[data-counters]')!;
    while (host.children.length > items.length) host.lastElementChild!.remove();
    items.forEach(([label, value, strong], i) => {
      let item = host.children[i] as HTMLElement | undefined;
      if (!item) {
        item = document.createElement('div');
        item.append(document.createElement('strong'), document.createElement('span'));
        host.append(item);
      }
      const [v, l] = item.children as unknown as [HTMLElement, HTMLElement];
      if (v.textContent !== String(value)) {
        v.textContent = String(value);
        item.classList.remove('ix-bump');
        void item.offsetWidth;
        item.classList.add('ix-bump');
      }
      l.textContent = label;
      item.classList.toggle('ix-emphasis', Boolean(strong));
      item.classList.toggle('ix-word', typeof value === 'string' && /[a-z]{3,}/i.test(value));
    });
  }

  protected param(name: string): string {
    const input = this.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-param="${name}"]`)!;
    return input instanceof HTMLInputElement && input.type === 'checkbox' ? String(input.checked) : input.value;
  }

  /** Figures whose drawing should animate between parameter values keep it. */
  protected keepDrawing = false;
  private drawn = false;

  protected rebuild(fromInput: boolean) {
    this.pause();
    this.frames = this.build();
    if (!this.keepDrawing || !this.drawn) this.draw(this.layout);
    this.drawn = true;
    this.go(0);
    if (fromInput && !reducedMotion()) window.setTimeout(() => this.play(), 250);
  }

  private measure(): Layout {
    return this.stage.clientWidth >= this.wideAt ? 'wide' : 'narrow';
  }

  protected go(index: number) {
    this.cursor = Math.max(0, Math.min(this.frames.length - 1, index));
    const frame = this.frames[this.cursor];
    this.render(frame, this.cursor);
    this.status.textContent = frame.note;
    this.stepLabel.textContent = `Step ${this.cursor + 1} of ${this.frames.length}`;
    this.backButton.disabled = this.cursor === 0;
    this.nextButton.disabled = this.cursor === this.frames.length - 1;
    this.syncPlayButton();
  }

  protected play() {
    if (this.cursor >= this.frames.length - 1) this.go(0);
    this.playing = true;
    this.status.setAttribute('aria-live', 'off');
    this.syncPlayButton();
    this.schedule();
  }

  protected pause() {
    this.playing = false;
    window.clearTimeout(this.timer);
    this.status.setAttribute('aria-live', 'polite');
    this.syncPlayButton();
  }

  private schedule() {
    window.clearTimeout(this.timer);
    const hold = this.frames[this.cursor].hold ?? 1100;
    this.timer = window.setTimeout(() => {
      if (!this.playing) return;
      if (this.cursor >= this.frames.length - 1) { this.pause(); return; }
      this.go(this.cursor + 1);
      this.schedule();
    }, hold);
  }

  private syncPlayButton() {
    const atEnd = this.cursor >= this.frames.length - 1;
    this.playButton.textContent = this.playing ? 'Pause' : atEnd ? 'Replay' : 'Play';
    this.playButton.setAttribute('aria-pressed', String(this.playing));
    this.dataset.playing = String(this.playing);
  }
}

// --- SVG helpers -----------------------------------------------------------

const NS = 'http://www.w3.org/2000/svg';

export function svg(tag: string, attrs: Record<string, string | number> = {}, text?: string) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
}

export function canvas(stage: HTMLElement, width: number, height: number, label: string, scale = 1.25) {
  stage.replaceChildren();
  const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': label, class: 'ix-svg' });
  root.style.maxWidth = `${Math.round(width * scale)}px`;
  stage.append(root);
  return root;
}

/** Move a group smoothly; CSS transitions animate the transform property. */
export function place(node: SVGElement, x: number, y: number) {
  node.style.transform = `translate(${x}px, ${y}px)`;
}

export function setState(node: Element | null | undefined, state: string) {
  if (node && node.getAttribute('data-state') !== state) node.setAttribute('data-state', state);
}
