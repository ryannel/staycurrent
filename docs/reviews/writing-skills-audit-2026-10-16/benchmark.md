# Writing benchmark

Human prose we measure our writing and our checks against. The site's reader is
a working engineer skimming for terms they might know, so the benchmark is a
reference book written for that reader. The user named *Designing
Data-Intensive Applications* as the model. It isn't freely available, so we use
the closest book that is.

| Chapter | Book | Repository and commit | File |
| --- | --- | --- | --- |
| Building Blocks of TCP | Ilya Grigorik, *High Performance Browser Networking* (O'Reilly, 2013) | `igrigorik/hpbn.co` at `0cc06d75b5e9de091d20f68951e39115082d0177` | `building-blocks-of-tcp/index.html` |
| HTTP/2 | Ilya Grigorik, *High Performance Browser Networking* (O'Reilly, 2013) | same | `http2/index.html` |

Published versions: <https://hpbn.co/building-blocks-of-tcp/> and
<https://hpbn.co/http2/>.

The text is licensed CC BY-NC-ND 4.0. Read it from a clone and quote briefly
with attribution; don't copy chapters into this repository.

```bash
dir="${TMPDIR:-/tmp}/staycurrent-benchmark"
git clone https://github.com/igrigorik/hpbn.co "$dir/hpbn"
git -C "$dir/hpbn" checkout 0cc06d75b5e9de091d20f68951e39115082d0177
```

The chapters are the published HTML. `<aside>` elements are sidebars, and
level-four headings mark them. Extracting plain text drops the equations, so
read the HTML or the published page when a calculation matters. The files are
only read, never served or run.

## Why this book

Its headings are the terms an engineer would skim for, and the first sentence
of each section usually defines the term or sets it against something familiar.
Sections vary in length with the material and follow no template. The book
predates language models.

It isn't perfect. Some terms arrive late in their sections, the HTTP/2 chapter
spends about 200 lines on history before its first defined term, and there's
some promotional tone. Some of its HTTP/2 content, such as stream priorities and
server push, has since been deprecated. That matters for content but not for
the writing comparison.

## Additions

- *Designing Data-Intensive Applications* (Kleppmann): the user's model. If
  chapters are supplied, they become the primary benchmark, read locally and
  never committed.
- Sam Who, Bartosz Ciechanowski and Julia Evans, the explainers
  `docs/writing-style.md` names, aren't reachable from this environment and are
  written for a different reader: someone following an explanation from the top.
