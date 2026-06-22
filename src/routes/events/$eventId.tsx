import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@clerk/react";
import { useState, type FormEvent } from "react";
import { useEvents } from "../../context/useEvents";
import { OccupancyBar } from "../../components/OccupancyBar";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetails,
});

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-sky-100 text-sky-700",
};

function EventDetails() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const { events, addAttendee, removeAttendee, deleteEvent } = useEvents();
  const { userId } = useAuth();

  // Attendee registration input states
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [formError, setFormError] = useState("");

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center max-w-2xl">
        <h2 className="text-xl font-bold text-slate-900">Event not found.</h2>
        <p className="text-sm text-slate-600 mt-1">
          This event might have been deleted or doesn't exist.
        </p>
        <Link
          to="/events"
          className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
        >
          Back to events
        </Link>
      </div>
    );
  }

  const currentEvent = event;
  const canDeleteEvent = currentEvent.createdByUserId === userId;

  function handleAddAttendee(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    // Field verification checks
    if (!attendeeName.trim()) {
      setFormError("Name field cannot be left empty.");
      return;
    }
    if (!attendeeEmail.trim() || !attendeeEmail.includes("@")) {
      setFormError("Please enter a valid email address containing an '@'.");
      return;
    }
    if (currentEvent.attendees.length >= currentEvent.maxAttendees) {
      setFormError(
        "Cannot add attendee. The event capacity limit has been reached.",
      );
      return;
    }
    const alreadyRegistered = currentEvent.attendees.some(
      (attendee) =>
        attendee.email.toLowerCase() === attendeeEmail.trim().toLowerCase(),
    );
    if (alreadyRegistered) {
      setFormError("This email is already registered for this event.");
      return;
    }

    const newAttendee = {
      id: crypto.randomUUID(),
      name: attendeeName.trim(),
      email: attendeeEmail.trim().toLowerCase(),
    };

    addAttendee(currentEvent.id, newAttendee);

    setAttendeeName("");
    setAttendeeEmail("");
  }

  function handleRemoveAttendee(attendeeId: string) {
    removeAttendee(currentEvent.id, attendeeId);
  }

  function handleDelete() {
    if (!canDeleteEvent) {
      return;
    }

    const shouldDelete = window.confirm(
      `Do you really want to delete the event "${currentEvent.title}"?`,
    );
    if (shouldDelete) {
      deleteEvent(currentEvent.id);
      navigate({ to: "/events" });
    }
  }

  return (
    <div className="max-w-2xl space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header section info layout */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            {currentEvent.category}
          </span>
          <h1 className="text-3xl font-bold text-slate-950 mt-0.5">
            {currentEvent.title}
          </h1>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[currentEvent.status]}`}
        >
          {currentEvent.status}
        </span>
      </div>

      <div className="space-y-1 text-sm text-slate-600 border-l-2 border-teal-600 pl-3">
        <p className="font-medium text-slate-900">
          When: {formatDate(currentEvent.date)} at {currentEvent.time}
        </p>
        <p>Where: {currentEvent.location}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">Description</h3>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
          {currentEvent.description}
        </p>
      </div>

      {/* Interactive visual progress meter section */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Attendance Capacity
        </h3>
        <OccupancyBar
          current={currentEvent.attendees.length}
          max={currentEvent.maxAttendees}
        />
      </div>

      {/* Renders management list for existing sub-level records */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Registered Attendees
        </h3>
        {currentEvent.attendees.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No attendees signed up yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-md border border-slate-200 px-3 bg-slate-50/50">
            {currentEvent.attendees.map((attendee) => (
              <li
                key={attendee.id}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{attendee.name}</p>
                  <p className="text-xs text-slate-500">{attendee.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveAttendee(attendee.id)}
                  className="text-xs font-medium text-rose-600 hover:text-rose-900 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Inline Registration Form Panel */}
      {currentEvent.attendees.length < currentEvent.maxAttendees && (
        <form
          onSubmit={handleAddAttendee}
          className="border-t border-slate-100 pt-4 space-y-3"
        >
          <h3 className="text-sm font-semibold text-slate-900">Add Attendee</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100"
            />
            <input
              type="text"
              placeholder="Email Address"
              value={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100"
            />
          </div>
          {formError && <p className="text-xs text-red-600">{formError}</p>}
          <button
            type="submit"
            className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 transition"
          >
            Register Attendee
          </button>
        </form>
      )}

      {/* System Action Control Links Footer */}
      <div className="flex gap-3 border-t border-slate-200 pt-5 mt-8">
        <Link
          to="/events/$eventId/edit"
          params={{ eventId: currentEvent.id }}
          className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
        >
          Edit Event
        </Link>
        {canDeleteEvent && (
          <button
            onClick={handleDelete}
            className="rounded-md bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 transition"
          >
            Delete Event
          </button>
        )}
        <Link
          to="/events"
          className="ml-auto rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Back to list
        </Link>
      </div>
    </div>
  );
}
