import { createContext } from "react";
import type { Attendee, Event } from "../types/event";

export type EventsContextValue = {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addAttendee: (eventId: string, attendee: Attendee) => void;
};

// Only the context object lives here — no component, no hook
export const EventsContext = createContext<EventsContextValue | undefined>(
  undefined,
);
