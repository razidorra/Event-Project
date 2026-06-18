import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useEvents } from "../../context/useEvents";
import type { Event, EventCategory, EventStatus } from "../../types/event";

export const Route = createFileRoute("/events/new")({
  component: NewEvent,
});

// Turns a title like "React Basics Workshop" into an id like "react-basics-workshop"
function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Shape of the validation errors — one optional message per field
type FormErrors = {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  maxAttendees?: string;
};

function NewEvent() {
  const { addEvent, events } = useEvents();
  const navigate = useNavigate();

  // Controlled form state — one piece of state per field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("workshop");
  const [status, setStatus] = useState<EventStatus>("draft");
  const [maxAttendees, setMaxAttendees] = useState(10);

  const [errors, setErrors] = useState<FormErrors>({});

  // Checks all fields and returns an object with one message per invalid field.
  // An empty object means the form is valid.
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

    return newErrors;
  }

  function handleSubmit(e: FormEvent) {
    // Prevents the browser from doing a full page reload on submit
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    // If there's at least one error, stop here and let the user fix it
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Build a base id from the title, and make sure it's unique among existing events
    const baseId = slugify(title) || "event";
    let id = baseId;
    let counter = 1;
    while (events.some((event) => event.id === id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    const newEvent: Event = {
      id,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      status,
      maxAttendees,
      attendees: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    addEvent(newEvent);
    // After creating the event, jump straight to its detail page
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

        <button
          type="submit"
          className="mt-2 w-fit rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Create Event
        </button>
      </form>
      </div>
    </div>
  );
}
