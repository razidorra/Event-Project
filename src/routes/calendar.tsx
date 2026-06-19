import { createFileRoute, Link } from "@tanstack/react-router";
import { useEvents } from "../context/useEvents";
import type { Event } from "../types/event";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function formatDateHeader(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function isPastEvent(dateStr: string) {
  const todayStr = new Date().toISOString().split("T")[0];
  return dateStr < todayStr;
}

export function CalendarPage() {
  const { events } = useEvents();

  // Filter down to active, viewable records
  const publishedEvents = events.filter(
    (e) => e.status === "published" || e.status === "completed",
  );

  // Group events by matching date string keys
  const groupedEvents = publishedEvents.reduce<Record<string, Event[]>>(
    (groups, event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    },
    {},
  );

  // Sort dates chronological (ascending order)
  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Calendar Overview</h1>
        <p className="text-sm text-slate-600 mt-1">
          Track all published and scheduled upcoming sessions organized by
          timeline sequence.
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center bg-white">
          <p className="text-sm text-slate-600">
            No published events found on schedule.
          </p>
          <Link
            to="/events/new"
            className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
          >
            Schedule your first event
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dateIsPast = isPastEvent(date);

            // Sort day events by time ascending
            const dailyEvents = groupedEvents[date].sort((a, b) =>
              a.time.localeCompare(b.time),
            );

            return (
              <section
                key={date}
                className={`space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition ${
                  dateIsPast ? "opacity-60 bg-slate-50/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    📅 {formatDateHeader(date)}
                  </h2>
                  {dateIsPast && (
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-xxs font-semibold uppercase tracking-wider text-slate-600">
                      Past Event
                    </span>
                  )}
                </div>

                <ul className="divide-y divide-slate-100">
                  {dailyEvents.map((event) => (
                    <li
                      key={event.id}
                      className="py-2 flex items-center justify-between text-sm gap-4"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-teal-700 font-semibold shrink-0">
                          {event.time}
                        </span>
                        <span className="text-slate-800 font-medium">
                          {event.title}
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline capitalize">
                          ({event.category} • {event.location})
                        </span>
                      </div>
                      <Link
                        to="/events/$eventId"
                        params={{ eventId: event.id }}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 whitespace-nowrap shrink-0"
                      >
                        View →
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
