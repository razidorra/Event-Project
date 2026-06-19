import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEvents } from "../../context/useEvents";
import { EventForm, type EventFormValues } from "../../components/EventForm";

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEvent,
});

function EditEvent() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const { events, updateEvent } = useEvents();
  const currentEvent = events.find((e) => e.id === eventId);

  if (!currentEvent) {
    return (
      <div className="max-w-2xl rounded-lg border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Event not found.
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          The event you are trying to edit does not exist.
        </p>
        <Link
          to="/events"
          className="mt-3 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          Back to events
        </Link>
      </div>
    );
  }

  const editableEvent = currentEvent;

  function handleUpdate(values: EventFormValues) {
    updateEvent(editableEvent.id, values);
    navigate({ to: "/events/$eventId", params: { eventId } });
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Edit Mode
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          Edit: {editableEvent.title}
        </h1>

        <EventForm
          initialValues={editableEvent}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
