import { Link } from "@tanstack/react-router";
import type { Event } from "../types/event";

// Maps each status to a matching Tailwind color class.
// Avoids if/else chains in the JSX below — we just look it up by key (e.g. "draft").
const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-sky-100 text-sky-700",
};

// Converts a date like "2026-06-24" (ISO, good for sorting/storing)
// into "24.06.2026" (more readable for users).
function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

// Displays a single event as a card.
// Receives the full event object as a prop and shows the most important
// info in a compact way, plus a link to the detail page.
export function EventCard({ event }: { event: Event }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{event.title}</h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[event.status]}`}
        >
          {event.status}
        </span>
      </div>

      <div className="space-y-1 text-sm text-slate-600">
        <p>{formatDate(event.date)} at {event.time}</p>
        <p>{event.location}</p>
        <p className="capitalize">{event.category}</p>
      </div>

      <p className="mt-auto text-sm text-slate-600">
        {event.attendees.length} / {event.maxAttendees} attendees
      </p>

      {/*
        "to" specifies the route, "params" fills in $eventId in the URL.
        TanStack Router automatically builds a link like "/events/react-workshop" from this.
      */}
      <Link
        to="/events/$eventId"
        params={{ eventId: event.id }}
        className="w-fit text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        View Details
      </Link>
    </article>
  );
}
