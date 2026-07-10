/**
 * Home page — Server Component.
 *
 * This is the landing page for the application. Replace this with
 * your actual home page content (the Topic Library view, 01-ui-design.md —
 * out of scope for this slice).
 *
 * Root-level markup is a <div>, not a second <main> — the root layout
 * (app/layout.tsx) already renders the page's one <main id="main-content">
 * landmark as part of the shared shell; a second <main> here would be a
 * nested/duplicate landmark (axe: landmark-no-duplicate-main).
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-foreground">
          Site
        </h1>
        <p className="text-muted-foreground">
          Your Next.js application is running.
        </p>
      </div>
    </div>
  );
}
