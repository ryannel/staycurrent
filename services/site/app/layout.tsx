import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Literata } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { Sidebar, type TopicNavEntry } from '@/components/shell/sidebar'
import { FreshnessCorrection } from '@/components/shell/freshness-correction'
import { getTopic, getTopicCutDate, getTopicSlugs } from '@/lib/content'
import { isFresh } from '@/lib/freshness'
import './globals.css'

// Type Scale (docs/design-system.md § Graphical UI): three self-hosted,
// subsetted families, `font-display: swap` with size-adjusted fallbacks —
// next/font's own output already carries the subsetting and the
// ascent/descent/size-adjust fallback metrics; `weight: 'variable'` ships the
// true variable-font axis Literata/Inter both need (opsz auto, arbitrary
// intermediate weights like 550/640).
// Each next/font instance's own CSS variable is deliberately NOT named
// --font-serif/--font-sans/--font-mono directly — globals.css's `@theme inline`
// bridges these `-nextfont` variables to those token names, so Tailwind's
// generated `:root { --font-sans: var(--font-sans-nextfont); }` is a real
// alias rather than a self-referential `--font-sans: var(--font-sans)`.
const literata = Literata({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-serif-nextfont',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sans-nextfont',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-mono-nextfont',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Stay Current',
  description: 'A living article that states its version and last-researched date without being asked.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ee' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1a17' },
  ],
}

/**
 * Sidebar topic-tree data (App Shell spec). Reuses the content-layer entry
 * points this slice's constraints name — `getTopicSlugs`/`getTopic` — plus
 * `getTopicCutDate` (both still `@staycurrent/core`'s public Loading API, via
 * `loadVersion`, never a direct `topics/` read). Errors propagate uncaught: a
 * broken `topics/` tree fails the whole build here exactly as it fails the
 * per-page render (02-data-flows.md, "currency is never guessed").
 *
 * Freshness keys on the CURRENT VERSION'S CUT DATE, not `last_researched` — a
 * no-cut research run updates the latter without lighting the dot.
 */
function buildTopicNavEntries(): TopicNavEntry[] {
  return getTopicSlugs()
    .slice()
    .sort()
    .map((slug) => {
      const { frontmatter } = getTopic(slug)
      const cutDate = getTopicCutDate(slug, frontmatter.version)
      return { slug, title: frontmatter.title, isFresh: isFresh(cutDate), cutDate }
    })
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const { default: Providers } = await import('@/components/providers/default')
  const topics = buildTopicNavEntries()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${literata.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider
          // Both mechanisms, in tandem: `data-theme` is doc-shell.css's own
          // (hand-authored) hook, while `class` is what Tailwind's
          // `@custom-variant dark (&:is(.dark *))` and brand.css's generated
          // `.dark { --gw-*: ... }` block both key on — `data-theme` alone
          // left every `dark:` utility and the atmosphere tokens' dark
          // variants permanently on their light values (dark mode split in
          // two, confirmed live). next-themes 0.4.6 supports the array form
          // (verified against its shipped `Attribute[]` type and script).
          attribute={['class', 'data-theme']}
          defaultTheme="system"
          enableSystem
          storageKey="theme"
          enableColorScheme={false}
        >
          <Providers>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <div className="doc-shell">
              <Sidebar topics={topics} />
              <main id="main-content" className="doc-shell-main">
                {children}
              </main>
            </div>
            <Toaster position="bottom-right" richColors closeButton />
            <FreshnessCorrection />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
