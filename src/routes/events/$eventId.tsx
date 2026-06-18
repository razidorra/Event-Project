import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useEvents } from "../../context/useEvents";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetail,
});

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

// Very small check for "looks like an email" — good enough for this demo app
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function EventDetail() {
  const { eventId } = Route.useParams();
  const { events, deleteEvent, addAttendee } = useEvents();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId);

  // State for the "add attendee" form
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeeError, setAttendeeError] = useState("");

  if (!event) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold">Event not found.</p>
        <Link to="/events" className="text-blue-600 hover:underline">
          Back to events
        </Link>
      </div>
    );
  }

  const currentEvent = event;

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${currentEvent.title}"? This cannot be undone.`,
    );
    if (confirmed) {
      deleteEvent(currentEvent.id);
      navigate({ to: "/events" });
    }
  }

  // True once the event has reached its maximum number of attendees
  const isFull =
    currentEvent.attendees.length >= currentEvent.maxAttendees;

  function handleAddAttendee(e: FormEvent) {
    e.preventDefault();

    if (attendeeName.trim().length < 2) {
      setAttendeeError("Name must be at least 2 characters long.");
      return;
    }
    if (!isValidEmail(attendeeEmail)) {
      setAttendeeError("Please enter a valid email address.");
      return;
    }
    if (isFull) {
      setAttendeeError("This event is already full.");
      return;
    }
    // Prevent the same email from signing up twice (case-insensitive comparison)
    const alreadyRegistered = currentEvent.attendees.some(
      (a) => a.email.toLowerCase() === attendeeEmail.trim().toLowerCase(),
    );
    if (alreadyRegistered) {
      setAttendeeError("This email is already registered for this event.");
      return;
    }

    addAttendee(currentEvent.id, {
      id: crypto.randomUUID(),
      name: attendeeName.trim(),
      email: attendeeEmail.trim(),
    });

    // Reset the form after a successful submit
    setAttendeeName("");
    setAttendeeEmail("");
    setAttendeeError("");
  }

  return (
    <div className="flex flex-col gap-3 max-w-xl">
      <Link
        to="/events"
        className="text-sm text-blue-600 hover:underline w-fit"
      >
        ← Back to events
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{currentEvent.title}</h1>
        <div className="flex gap-2">
          <Link
            to="/events/$eventId/edit"
            params={{ eventId: currentEvent.id }}
            className="rounded px-3 py-1.5 text-sm font-medium border hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="rounded px-3 py-1.5 text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-700">{currentEvent.description}</p>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="font-medium">Date</dt>
        <dd>{formatDate(currentEvent.date)}</dd>
        <dt className="font-medium">Time</dt>
        <dd>{currentEvent.time}</dd>
        <dt className="font-medium">Location</dt>
        <dd>{currentEvent.location}</dd>
        <dt className="font-medium">Category</dt>
        <dd className="capitalize">{currentEvent.category}</dd>
        <dt className="font-medium">Status</dt>
        <dd className="capitalize">{currentEvent.status}</dd>
        <dt className="font-medium">Max Attendees</dt>
        <dd>{currentEvent.maxAttendees}</dd>
        <dt className="font-medium">Current Attendees</dt>
        <dd>{currentEvent.attendees.length}</dd>
      </dl>

      <div>
        <h2 className="font-semibold mt-2">Attendees</h2>
        {currentEvent.attendees.length === 0 ? (
          <p className="text-sm text-gray-500">No attendees yet.</p>
        ) : (
          <ul className="list-disc list-inside text-sm">
            {currentEvent.attendees.map((a) => (
              <li key={a.id}>
                {a.name} ({a.email})
              </li>
            ))}
          </ul>
        )}

        {/* Add-attendee form, hidden once the event is full */}
        {isFull ? (
          <p className="text-sm text-amber-600 mt-2">
            This event has reached its maximum capacity.
          </p>
        ) : (
          <form
            onSubmit={handleAddAttendee}
            className="flex flex-wrap gap-2 mt-3 items-start"
          >
            <input
              type="text"
              placeholder="Name"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-3 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Add Attendee
            </button>
          </form>
        )}
        {attendeeError && (
          <p className="text-sm text-red-600 mt-1">{attendeeError}</p>
        )}
      </div>
    </div>
  );
}
