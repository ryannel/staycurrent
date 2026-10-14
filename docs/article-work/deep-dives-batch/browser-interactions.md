# Browser interaction review

Checked 14 October 2026 against the built local preview at
`http://127.0.0.1:4322`, using Playwright and headless Chromium at 1280 × 900.
All interaction assertions pass. No uncaught browser JavaScript errors occurred.
The coordinator handles screenshots, themes, narrow layouts and navigation.

The reproducible runner is `browser-interactions.mjs`; its complete result is
`browser-interactions.json`. It launches the locally installed Playwright Chromium
and uses the temporary Playwright package under `/private/tmp/staycurrent-browser`.
It tests the rendered controls and DOM output, without calling the models directly.

- Design rules: all 192 combinations of six proposals and five rules. Acceptance,
  displayed identity, product and quantity agree with the expected constraint
  semantics. Reset retains the proposal and restores precisely the intended rules.
  Space toggles the required-value checkbox; Enter activates reset.
- Query work: all 18 combinations of catalogue size, receipt size and method.
  Every returned row and amount is correct; the route length and operation counts
  match the selected method. Native select typeahead (`b`, then Tab) changes to
  the lookup method and updates its result.
- Recovery: all 24 states across both hidden outcomes and both identity choices.
  Committed stock and order counts agree, both missing replies show the same
  application evidence, and Previous/Next disabled states are correct. Every
  Previous step and reset works; reset retains the chosen outcome and key policy.
  Enter advances and Space resets the native buttons.
- Current and historical facts: both layouts support name correction. The copied
  layout initially leaves one old copy, then updates it. The referenced layout
  resolves the corrected name for both orders immediately. A catalogue change to
  EUR 20 retains the historical EUR 36 purchase total. Reset restores the initial
  names and catalogue while retaining the selected layout.
- Concurrent purchases: all 36 states across three methods and both A endings.
  Committed counters agree with the described schedule. Only the unsafe method
  after A commits ends with two purchases; every other ending records one.
  Every Previous step, disabled endpoint and reset works; reset retains choices.

The initial keyboard test assumed ArrowDown/Enter would commit a native macOS
select change in headless Chromium. It did not. A separate native-control probe
confirmed typeahead and Tab, which the final runner uses. This was a test-input
correction; no product change was needed.

The first browser launch was prevented by the execution sandbox. The approved
escalated launch completed these checks against the local preview. No article or
component edits were made during this review.
