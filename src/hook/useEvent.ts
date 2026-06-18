import { useEffect, useState } from "react";
import { initialEvents } from "../data/initialEvents";
import type { Event } from "../types/event";

const STORAGE_KEY = "eventboard-events";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);

    if (storedEvents) {
      return JSON.parse(storedEvents);
    }

    return initialEvents;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const getEventById = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const createEvent = (newEvent: Event) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  const resetEvents = () => {
    setEvents(initialEvents);
  };

  return {
    events,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    resetEvents,
  };
}
