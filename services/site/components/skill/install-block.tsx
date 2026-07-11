'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ICON_STROKE_WIDTH } from '@/lib/icons';

export interface InstallBlockProps {
  /** The canonical one-liner, verbatim (03-api-design.md). */
  command: string;
}

const COPY_LABEL = 'Copy code';
const COPIED_LABEL = 'Copied';
const COPIED_DURATION_MS = 1500;

/**
 * `/[topic]/skill/`'s install code block (01-ui-design.md): a header-stripped
 * code block ("install.sh" label, ghost copy icon) plus the page's sole
 * `.btn-primary` CTA — both trigger the identical copy action and share one
 * "copied" confirmation (Key interactions: "Click 'Install skill' → same
 * copy action"), the icon swap in the header being the site's one inline
 * "toast" either button lands on.
 *
 * A real React client component, not DOM-injected the way
 * `components/article/enhancements.tsx`'s `ArticleEnhancements` progressively
 * enhances markdown-rendered `<pre>` blocks — this page has exactly one code
 * block and it was never parsed from markdown, so it is authored directly
 * here instead, following the same ghost-copy-affordance conventions (visible
 * always, glyph swaps to a check for 1500ms, `aria-label` states "Copy
 * code"/"Copied").
 *
 * The command renders as an ordinary JSX text child — React's server
 * renderer HTML-escapes it (` && ` becomes `&amp;&amp;` in the static
 * export's raw HTML), which is the CORRECT behavior for real markup; the
 * milestone-3 proof that reads the raw HTML file now parses/unescapes it
 * before checking for the literal one-liner (see that test's own comment),
 * rather than the raw byte-string grep that previously forced this component
 * into `dangerouslySetInnerHTML`.
 */
export function InstallBlock({ command }: InstallBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = () => {
    // Only confirm on an actual successful write — a browser/context lacking
    // the Clipboard API (or a write that the platform rejects) must not
    // report success it didn't deliver.
    void navigator.clipboard?.writeText(command).then(
      () => {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }
        setCopied(true);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, COPIED_DURATION_MS);
      },
      () => {}
    );
  };

  return (
    <>
      <div className="install-block">
        <div className="install-block-header">
          <span className="install-block-filename">install.sh</span>
          <button
            type="button"
            className={`install-copy-btn${copied ? ' is-copied' : ''}`}
            aria-label={copied ? COPIED_LABEL : COPY_LABEL}
            onClick={copy}
          >
            {copied ? (
              <Check size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
            ) : (
              <Copy size={16} strokeWidth={ICON_STROKE_WIDTH} aria-hidden="true" />
            )}
          </button>
        </div>
        {/* Genuinely overflows the reading column at this length on every
            viewport this site ships (Code blocks spec: horizontal scroll,
            never wrapped) — statically focusable/labelled rather than the
            dynamic overflow-detection `enhanceScrollableRegions` applies to
            `.article-body`'s many candidates: this page carries exactly one
            code block, so the always-on treatment costs nothing and keeps
            axe's scrollable-region-focusable rule satisfied unconditionally. */}
        <pre className="install-block-code" tabIndex={0} role="region" aria-label="Install command">
          {command}
        </pre>
      </div>
      <button type="button" className="btn-primary" onClick={copy}>
        Install skill
      </button>
    </>
  );
}
