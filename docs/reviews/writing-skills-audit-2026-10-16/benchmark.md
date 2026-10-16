# Writing benchmark

Human prose we measure our writing and our checks against. The texts aren't
copied here: both books' prose is licensed CC BY-NC-ND 4.0, so read them from a
clone at the pinned commits and quote briefly with attribution.

| Chapter | Book | Repository and commit | File |
| --- | --- | --- | --- |
| A Map of the Territory | Robert Nystrom, *Crafting Interpreters* | `munificent/craftinginterpreters` at `4a840f70f69c6ddd17cfef4f6964f8e1bcd8c3d4` | `book/a-map-of-the-territory.md` |
| State | Robert Nystrom, *Game Programming Patterns* | `munificent/game-programming-patterns` at `898b1f2e1818c80d7eed5eba98e9903ec13b7771` | `book/state.markdown` |

Published versions: <https://craftinginterpreters.com/a-map-of-the-territory.html>
and <https://gameprogrammingpatterns.com/state.html>.

```bash
dir="${TMPDIR:-/tmp}/staycurrent-benchmark"
git clone https://github.com/munificent/craftinginterpreters "$dir/ci"
git -C "$dir/ci" checkout 4a840f70f69c6ddd17cfef4f6964f8e1bcd8c3d4
git clone https://github.com/munificent/game-programming-patterns "$dir/gpp"
git -C "$dir/gpp" checkout 898b1f2e1818c80d7eed5eba98e9903ec13b7771
```

The source is Markdown with a few extensions. `<aside>` blocks are margin notes
on the published page. `^code name` marks where a code sample appears; *Game
Programming Patterns* keeps its samples in separate C++ files, so read the
published chapter when the code matters.

The texts are only read, never built or run.

## Why these two

*A Map of the Territory* walks one line of code through every stage of a
language implementation. It's an overview whose headings are the stages
themselves, the closest match to our collection introductions. *State* teaches
an idea by growing one example, the heroine's jump, until the idea is the
obvious fix. It's the closest match to the drawing-systems articles.

Sam Who's *Load Balancing*, Bartosz Ciechanowski's *Gears* and Julia Evans's
posts, which `docs/writing-style.md` already names, should join when the
environment's network policy allows `samwho.dev`, `ciechanow.ski` and `jvns.ca`.
