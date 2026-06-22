// Possible status values an event can have.
// A union type prevents types like "Draft " from sneaking in anywhere.
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

// Possible categories for an event.
export type EventCategory =
  | "workshop"
  | "talk"
  | "networking"
  | "review"
  | "other";

// A single attendee of an event.
export type Attendee = {
  id: string;
  name: string;
  email: string;
};

// The central data model for an event.
// Every component that works with events imports this type,
// so TypeScript expects the same shape everywhere.
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  status: EventStatus;
  maxAttendees: number;
  attendees: Attendee[];
  createdAt: string;
  createdByUserId?: string;
};
