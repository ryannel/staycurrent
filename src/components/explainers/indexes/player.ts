// Shared behaviour for the Indexes figures: a sequence of frames with
// play/pause, step back, step forward and reset, a narration line that says
// what each frame shows, and a layout that switches between wide and narrow.

export interface Frame {
  note: string;      // the full sentence for this moment, shown when stepping
  short?: string;    // an optional shorter line shown while playing
  hold?: number;     // minimum milliseconds to stay on this frame while playing
  quick?: boolean;   // a repeating frame with short text: use `hold` as given
}

export type Layout = 'wide' | 'narrow';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Long enough to read the line on screen, at roughly 230 words a minute. */
const readingTime = (text: string) => 900 + text.length * 45;

export abstract class IndexFigure<F extends Frame> extends HTMLElement {
  protected frames: F[] = [];
  protected cursor = 0;
  protected layout: Layout = 'wide';
  private timer = 0;
  private playing = false;
  private autoplayed = false;
  private resumeOnReturn = false;
  private playButton!: HTMLButtonElement;
  private backButton!: HTMLButtonElement;
  private nextButton!: HTMLButtonElement;
  private stepLabel!: HTMLElement;
  private scrub!: HTMLInputElement;
  private status!: HTMLElement;
  protected stage!: HTMLElement;

  /** Wide layouts need at least this many pixels of stage width. */
  protected wideAt = 600;

  protected abstract build(): F[];
  protected abstract draw(layout: Layout): void;
  protected abstract render(frame: F, index: number): void;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.stage = this.querySelector('[data-stage]')!;
    this.playButton = this.querySelector('[data-play]')!;
    this.backButton = this.querySelector('[data-back]')!;
    this.nextButton = this.querySelector('[data-next]')!;
    this.stepLabel = this.querySelector('[data-step]')!;
    this.scrub = this.querySelector('[data-scrub]')!;
    this.scrub.addEventListener('input', () => { this.pause(); this.go(Number(this.scrub.value) - 1); });
    this.status = this.querySelector('[data-status]')!;
    this.playButton.addEventListener('click', () => (this.playing ? this.pause() : this.play()));
    this.backButton.addEventListener('click', () => { this.pause(); this.go(this.cursor - 1); });
    this.nextButton.addEventListener('click', () => { this.pause(); this.go(this.cursor + 1); });
    this.querySelector('[data-reset]')!.addEventListener('click', () => { this.pause(); this.go(0); });
    this.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[data-param], select[data-param]').forEach((input) =>
      input.addEventListener('change', () => this.rebuild(true)));
    this.querySelectorAll<HTMLElement>('[data-segmented]').forEach((group) => {
      group.querySelectorAll<HTMLButtonElement>('button[data-value]').forEach((button) =>
        button.addEventListener('click', () => {
          if (group.dataset.value === button.dataset.value) return;
          group.dataset.value = button.dataset.value;
          group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
          this.rebuild(true);
        }));
    });
    this.addEventListener('keydown', (event) => {
      if ((event.target as HTMLElement).matches('input, select')) return;
      if (event.key === 'ArrowRight') { this.pause(); this.go(this.cursor + 1); event.preventDefault(); }
      if (event.key === 'ArrowLeft') { this.pause(); this.go(this.cursor - 1); event.preventDefault(); }
    });
    this.setup();
    this.dataset.ready = 'true';
    this.layout = this.measure();
    this.rebuild(false);
    new ResizeObserver(() => {
      const next = this.measure();
      if (next !== this.layout) { this.layout = next; this.draw(next); this.render(this.frames[this.cursor], this.cursor); }
    }).observe(this.stage);
    new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      const seen = entry.isIntersecting && (entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.45);
      if (seen && !reducedMotion()) {
        if (!this.autoplayed) { this.autoplayed = true; window.setTimeout(() => this.play(), 300); }
        else if (this.resumeOnReturn) { this.resumeOnReturn = false; this.play(); }
      }
      if (!entry.isIntersecting && this.playing) { this.pause(); this.resumeOnReturn = true; }
    }, { threshold: [0, 0.25, 0.5] }).observe(this.stage);
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
        if (strong && this.playing) {
          item.classList.remove('ix-bump');
          void item.offsetWidth;
          item.classList.add('ix-bump');
        }
      }
      l.textContent = label;
      item.classList.toggle('ix-emphasis', Boolean(strong));
      item.classList.toggle('ix-word', /[a-z]/i.test(String(value).replace(/\bof\b/g, '')));
    });
  }

  protected param(name: string): string {
    const control = this.querySelector<HTMLElement>(`[data-param="${name}"]`)!;
    if (control instanceof HTMLInputElement && control.type === 'checkbox') return String(control.checked);
    if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) return control.value;
    return control.dataset.value ?? '';
  }

  /** Figures whose drawing should animate between parameter values keep it. */
  protected keepDrawing = false;
  private drawn = false;

  protected rebuild(fromInput: boolean) {
    this.pause();
    this.frames = this.build();
    if (!this.keepDrawing || !this.drawn) this.draw(this.layout);
    this.drawn = true;
    if (reducedMotion()) { this.go(this.frames.length - 1); return; }
    this.go(0);
    if (fromInput) window.setTimeout(() => this.play(), 250);
  }

  private measure(): Layout {
    return this.stage.clientWidth >= this.wideAt ? 'wide' : 'narrow';
  }

  private line(frame: F) {
    return this.playing && frame.short ? frame.short : frame.note;
  }

  protected go(index: number) {
    this.cursor = Math.max(0, Math.min(this.frames.length - 1, index));
    const frame = this.frames[this.cursor];
    this.render(frame, this.cursor);
    this.status.textContent = this.line(frame);
    this.stepLabel.textContent = `${this.cursor + 1} / ${this.frames.length}`;
    this.scrub.max = String(this.frames.length);
    this.scrub.value = String(this.cursor + 1);
    this.scrub.setAttribute('aria-valuetext', `Step ${this.cursor + 1} of ${this.frames.length}`);
    this.backButton.disabled = this.cursor === 0;
    this.nextButton.disabled = this.cursor === this.frames.length - 1;
    this.syncPlayButton();
  }

  protected play() {
    this.resumeOnReturn = false;
    if (this.cursor >= this.frames.length - 1) this.go(0);
    this.playing = true;
    this.status.setAttribute('aria-live', 'off');
    this.status.textContent = this.line(this.frames[this.cursor]);
    this.syncPlayButton();
    this.schedule();
  }

  protected pause() {
    const was = this.playing;
    this.playing = false;
    window.clearTimeout(this.timer);
    this.status.setAttribute('aria-live', 'polite');
    if (was && this.frames[this.cursor]) this.status.textContent = this.frames[this.cursor].note;
    this.syncPlayButton();
  }

  private schedule() {
    window.clearTimeout(this.timer);
    const frame = this.frames[this.cursor];
    const hold = frame.quick ? frame.hold ?? 600 : Math.max(frame.hold ?? 1100, readingTime(this.line(frame)));
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

/** Replace the stage's drawing. The SVG is described by the figure's text alternative. */
export function canvas(stage: HTMLElement, width: number, height: number, label: string, scale = 1.25) {
  stage.replaceChildren();
  const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': label, class: 'ix-svg' });
  const fallback = stage.closest('[data-figure]')?.querySelector('.ix-fallback');
  if (fallback?.id) root.setAttribute('aria-describedby', fallback.id);
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
