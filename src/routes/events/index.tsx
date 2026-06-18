import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useEvents } from "../../context/useEvents";
import { EventCard } from "../../components/EventCard";
import type { EventCategory, EventStatus } from "../../types/event";

export const Route = createFileRoute("/events/")({
  component: EventsOverview,
});

// Possible sort options for the dropdown
type SortOption = "date-asc" | "date-desc" | "title-asc";

function EventsOverview() {
  // events now comes from the shared context (and localStorage),
  // not from the static initialEvents file
  const { events } = useEvents();

  // State for the search input (title search)
  const [search, setSearch] = useState("");
  // State for the status filter. 'all' means "no filter active"
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  // State for the category filter
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">(
    "all",
  );
  // State for the currently selected sort order
  const [sortOption, setSortOption] = useState<SortOption>("date-asc");

  // useMemo recalculates the filtered/sorted list only when one of the
  // values in the dependency array below changes — not on every render.
  const filteredEvents = useMemo(() => {
    let result = events;

    // Search: lowercase both strings so the search is case-insensitive
    if (search.trim() !== "") {
      const term = search.toLowerCase();
      result = result.filter((event) =>
        event.title.toLowerCase().includes(term),
      );
    }

    // Only apply the status filter if "All Statuses" is not selected
    if (statusFilter !== "all") {
      result = result.filter((event) => event.status === statusFilter);
    }

    // Same idea for the category filter
    if (categoryFilter !== "all") {
      result = result.filter((event) => event.category === categoryFilter);
    }

    // [...result] creates a copy so .sort() doesn't mutate the original array
    const sorted = [...result].sort((a, b) => {
      if (sortOption === "date-asc") {
        // localeCompare works correctly here because our dates are stored
        // in "YYYY-MM-DD" format, which sorts correctly as plain strings
        return a.date.localeCompare(b.date);
      }
      if (sortOption === "date-desc") {
        return b.date.localeCompare(a.date);
      }
      // case: 'title-asc'
      return a.title.localeCompare(b.title);
    });

    return sorted;
  }, [events, search, statusFilter, categoryFilter, sortOption]);

  return (
    <section className="space-y-6">
      {/* Header row with title and a button to create a new event */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Manage
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Events</h1>
        </div>
        <Link
          to="/events/new"
          className="w-fit rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          New Event
        </Link>
      </div>

      {/* Filter and sort bar */}
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as EventStatus | "all")
          }
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as EventCategory | "all")
          }
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">All Categories</option>
          <option value="workshop">Workshop</option>
          <option value="talk">Talk</option>
          <option value="networking">Networking</option>
          <option value="review">Review</option>
          <option value="other">Other</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="date-asc">Date ascending</option>
          <option value="date-desc">Date descending</option>
          <option value="title-asc">Title A-Z</option>
        </select>
      </div>

      {/* If nothing matches the filters, show a hint instead of an empty grid */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          No events match your filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
