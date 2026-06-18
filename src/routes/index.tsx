import { createFileRoute, Link } from "@tanstack/react-router";
import { useEvents } from "../context/useEvents";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function Dashboard() {
  // events now comes from the shared context (and therefore from localStorage),
  // not from the static initialEvents file directly
  const { events } = useEvents();

  // Today's date as an ISO string (YYYY-MM-DD) so we can compare it to event.date
  const today = new Date().toISOString().split("T")[0];

  const totalEvents = events.length;
  const publishedCount = events.filter((e) => e.status === "published").length;
  const draftCount = events.filter((e) => e.status === "draft").length;
  const cancelledCount = events.filter((e) => e.status === "cancelled").length;
  const completedCount = events.filter((e) => e.status === "completed").length;

  // reduce() runs once over the array and accumulates the total attendee count
  const totalAttendees = events.reduce(
    (sum, event) => sum + event.attendees.length,
    0,
  );

  // Average utilization in percent:
  // compute attendees/maxAttendees for each event, then average across all events
  const averageUtilization =
    totalEvents === 0
      ? 0
      : Math.round(
          (events.reduce(
            (sum, event) => sum + event.attendees.length / event.maxAttendees,
            0,
          ) /
            totalEvents) *
            100,
        );

  // Upcoming events: date is today or later, and status is not "cancelled",
  // sorted ascending by date (soonest event first)
  const upcomingEvents = events
    .filter((event) => event.date >= today && event.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextEvent = upcomingEvents[0];
  const nextThreeEvents = upcomingEvents.slice(0, 3);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Dashboard</h1>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Events" value={totalEvents} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="Draft" value={draftCount} />
        <StatCard label="Cancelled" value={cancelledCount} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard label="Total Attendees" value={totalAttendees} />
        <StatCard label="Avg. Utilization" value={`${averageUtilization}%`} />
        <StatCard
          label="Next Event"
          value={nextEvent ? nextEvent.title : "No upcoming events"}
        />
      </div>

      {/* List of the next 3 events */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Upcoming Events
        </h2>
        {nextThreeEvents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No upcoming events.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {nextThreeEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="font-medium text-slate-950 hover:text-teal-800"
                >
                  {event.title}
                </Link>
                <span className="text-slate-500">{formatDate(event.date)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// Small reusable component for a single stat tile,
// so we don't have to copy-paste the same look 8 times
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
