import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

// This route is the "shell" for ALL pages — it always renders,
// no matter which subpage is currently active.
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-4">
          <span className="mr-4 text-lg font-bold text-slate-950">
            Event Board
          </span>
          {/* [&.active]:font-bold bolds the link once its route is active
              (TanStack Router automatically adds an "active" class) */}
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 [&.active]:bg-teal-50 [&.active]:text-teal-800"
          >
            Dashboard
          </Link>
          <Link
            to="/events"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 [&.active]:bg-teal-50 [&.active]:text-teal-800"
          >
            Events
          </Link>
          <Link
            to="/calendar"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 [&.active]:bg-teal-50 [&.active]:text-teal-800"
          >
            Calendar
          </Link>
          <Link
            to="/about"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 [&.active]:bg-teal-50 [&.active]:text-teal-800"
          >
            About
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Outlet is the placeholder where the currently active subpage gets rendered */}
        <Outlet />
      </main>
    </div>
  );
}
