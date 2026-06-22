import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEvents } from "../context/useEvents";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: Dashboard,
});

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function Dashboard() {
  const { events } = useEvents();

  const today = new Date().toISOString().split("T")[0];

  const totalEvents = events.length;
  const publishedCount = events.filter((e) => e.status === "published").length;
  const draftCount = events.filter((e) => e.status === "draft").length;
  const cancelledCount = events.filter((e) => e.status === "cancelled").length;
  const completedCount = events.filter((e) => e.status === "completed").length;

  const totalAttendees = events.reduce(
    (sum, event) => sum + event.attendees.length,
    0,
  );

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

  const upcomingEvents = events
    .filter((event) => event.date >= today && event.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextEvent = upcomingEvents[0];
  const nextThreeEvents = upcomingEvents.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

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

      <div>
        <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
        {nextThreeEvents.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming events.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {nextThreeEvents.map((event) => (
              <li
                key={event.id}
                className="border rounded p-3 text-sm flex items-center justify-between gap-3"
              >
                <Link
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="font-medium hover:underline truncate"
                >
                  {event.title}
                </Link>
                <span className="text-gray-500 shrink-0">
                  {formatDate(event.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// "truncate" keeps the value on a single line with an ellipsis if it's too long,
// so one long event title can't stretch the height of the entire grid row.
// "title={...}" shows the full text as a native tooltip on hover.
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold truncate" title={String(value)}>
        {value}
      </p>
    </div>
  );
}
