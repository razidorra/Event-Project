import { useEffect, useState, type ReactNode } from "react";
import type { Attendee, Event } from "../types/event";
import { initialEvents } from "../data/initialEvents";
import { EventsContext } from "./events-context";

const STORAGE_KEY = "eventboard-events";

function loadEvents(): Event[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Event[];
    } catch {
      return initialEvents;
    }
  }
  return initialEvents;
}

// This file now exports ONLY a component
export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(loadEvents);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  function addEvent(event: Event) {
    setEvents((prev) => [...prev, event]);
  }

  function updateEvent(id: string, updates: Partial<Event>) {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event)),
    );
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }

  function addAttendee(eventId: string, attendee: Attendee) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, attendees: [...event.attendees, attendee] }
          : event,
      ),
    );
  }

  function removeAttendee(eventId: string, attendeeId: string) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              attendees: event.attendees.filter(
                (attendee) => attendee.id !== attendeeId,
              ),
            }
          : event,
      ),
    );
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        addAttendee,
        removeAttendee,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
