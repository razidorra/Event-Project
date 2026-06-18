import { createFileRoute } from "@tanstack/react-router";
import { useEvents } from "../context/useEvents";

export const Route = createFileRoute("/calendar")({
  component: Calendar,
});

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function Calendar() {
  const { events } = useEvents();
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Schedule
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Calendar</h1>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          No events available yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[120px_1fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <span>Date</span>
            <span>Event</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {sortedEvents.map((event) => (
              <li
                key={event.id}
                className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[120px_1fr]"
              >
                <span className="text-sm font-medium text-slate-900">
                  {formatDate(event.date)}
                </span>
                <div>
                  <p className="font-medium text-slate-950">{event.title}</p>
                  <p className="text-sm text-slate-500">
                    {event.time} - {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
