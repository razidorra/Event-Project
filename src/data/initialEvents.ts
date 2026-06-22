import type { Event } from "../types/event";

// Static demo data used to seed the app the very first time it runs.
// The "Event[]" type makes TypeScript complain if a field is missing
// or a category/status value is misspelled.
export const initialEvents: Event[] = [
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
