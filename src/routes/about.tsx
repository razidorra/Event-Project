import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <section className="max-w-3xl space-y-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          About
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Event Board</h1>
      </div>

      <p className="text-base leading-7 text-slate-700">
        Event Board is a small event management dashboard built with React,
        TypeScript, TanStack Router, localStorage, and Tailwind CSS. It helps
        users create events, edit event details, filter the event list, and keep
        an overview of upcoming sessions.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Core features</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dashboard metrics, searchable event cards, detail pages, validation,
            editing, deleting, and persistent browser storage.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-950">Data model</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Each event stores title, description, date, time, location,
            category, status, capacity, attendees, and creation date.
          </p>
        </div>
      </div>
    </section>
  );
}
