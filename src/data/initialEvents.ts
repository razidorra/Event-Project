import type { Event } from "../types/event";

// Static demo data used to seed the app the very first time it runs.
// The "Event[]" type makes TypeScript complain if a field is missing
// or a category/status value is misspelled.
export const initialEvents: Event[] = [
  {
    id: "react-workshop",
    title: "React Basics Workshop",
    description: "A practical workshop about components, props and state.",
    date: "2026-06-24",
    time: "10:00",
    location: "Room A",
    category: "workshop",
    status: "published",
    maxAttendees: 16,
    attendees: [
      { id: "attendee-1", name: "Sarah Miller", email: "sarah@example.com" },
    ],
    createdAt: "2026-06-17",
  },
  {
    id: "portfolio-review",
    title: "Portfolio Review Day",
    description: "Students can receive feedback on their developer portfolios.",
    date: "2026-06-26",
    time: "13:00",
    location: "Online",
    category: "review",
    status: "draft",
    maxAttendees: 10,
    attendees: [],
    createdAt: "2026-06-17",
  },
];
