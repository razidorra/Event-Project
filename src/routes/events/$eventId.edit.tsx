import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useEvents } from "../../context/useEvents";
import type { EventCategory, EventStatus } from "../../types/event";

export const Route = createFileRoute("/events/$eventId/edit")({
  component: EditEvent,
});

type FormErrors = {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  maxAttendees?: string;
};

function EditEvent() {
  const { eventId } = Route.useParams();
  const { events, updateEvent } = useEvents();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === eventId);

  // Local form state, seeded with the event's current values using "??" as a fallback
  // in case "event" turns out to be undefined (handled further below)
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [time, setTime] = useState(event?.time ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [category, setCategory] = useState<EventCategory>(
    event?.category ?? "workshop",
  );
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "draft");
  const [maxAttendees, setMaxAttendees] = useState(event?.maxAttendees ?? 10);

  const [errors, setErrors] = useState<FormErrors>({});

  // Same "not found" pattern as on the detail page
  if (!event) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
        <p className="text-lg font-semibold text-slate-950">
          Event not found.
        </p>
        <Link
          to="/events"
          className="mt-2 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          Back to events
        </Link>
      </div>
    );
  }

  const currentEvent = event;

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }
    if (description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters long.";
    }
    if (!date) {
      newErrors.date = "Please select a date.";
    }
    if (!time) {
      newErrors.time = "Please select a time.";
    }
    if (location.trim().length === 0) {
      newErrors.location = "Location is required.";
    }
    if (maxAttendees < 1) {
      newErrors.maxAttendees = "Max attendees must be at least 1.";
    }
    // Don't allow shrinking capacity below the number of people already signed up
    if (maxAttendees < currentEvent.attendees.length) {
      newErrors.maxAttendees = `Cannot be lower than the current number of attendees (${currentEvent.attendees.length}).`;
    }

    return newErrors;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Only pass the editable fields — id, attendees and createdAt stay untouched
    updateEvent(currentEvent.id, {
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      status,
      maxAttendees,
    });

    navigate({ to: "/events/$eventId", params: { eventId: currentEvent.id } });
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/events/$eventId"
        params={{ eventId: currentEvent.id }}
        className="mb-5 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        Back to details
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
          Manage event
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Edit Event</h1>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="date" className="text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="time" className="text-sm font-medium text-slate-700">
              Time
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
            {errors.time && (
              <p className="text-sm text-red-600">{errors.time}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="location"
            className="text-sm font-medium text-slate-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 flex-1">
            <label
              htmlFor="category"
              className="text-sm font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="workshop">Workshop</option>
              <option value="talk">Talk</option>
              <option value="networking">Networking</option>
              <option value="review">Review</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label
              htmlFor="status"
              className="text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="maxAttendees"
            className="text-sm font-medium text-slate-700"
          >
            Max Attendees
          </label>
          <input
            id="maxAttendees"
            type="number"
            min={1}
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(Number(e.target.value))}
            className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          {errors.maxAttendees && (
            <p className="text-sm text-red-600">{errors.maxAttendees}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="w-fit rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            Save Changes
          </button>
          <Link
            to="/events/$eventId"
            params={{ eventId: currentEvent.id }}
            className="w-fit rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
      </div>
    </div>
  );
}
