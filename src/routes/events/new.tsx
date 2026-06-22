import {
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "@clerk/react";
import { useEvents } from "../../context/useEvents";
import { EventForm, type EventFormValues } from "../../components/EventForm";
import type { Event } from "../../types/event";

export const Route = createFileRoute("/events/new")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: NewEvent,
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function NewEvent() {
  const { addEvent, events } = useEvents();
  const navigate = useNavigate();
  const { userId } = useAuth();

  function handleCreate(values: EventFormValues) {
    if (!userId) return;

    const baseId = slugify(values.title) || "event";
    let id = baseId;
    let counter = 1;
    while (events.some((event) => event.id === id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    const newEvent: Event = {
      id,
      ...values,
      attendees: [],
      createdAt: new Date().toISOString().split("T")[0],
      createdByUserId: userId ?? undefined,
    };

    addEvent(newEvent);
    navigate({ to: "/events/$eventId", params: { eventId: id } });
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Manage event
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          Create New Event
        </h1>

        <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
      </div>
    </div>
  );
}
