import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useEvents } from "../context/useEvents";
import type { Event } from "../types/event";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateHeader(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function getMondayStartIndex(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function CalendarPage() {
  const { events } = useEvents();
  const todayKey = toDateKey(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const publishedEvents = events
    .filter(
      (event) =>
        event.status === "published" || event.status === "completed",
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  const eventsByDate = publishedEvents.reduce<Record<string, Event[]>>(
    (groups, event) => {
      groups[event.date] = [...(groups[event.date] ?? []), event];
      return groups;
    },
    {},
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = getMondayStartIndex(new Date(year, month, 1));
  const calendarCells = [
    ...Array.from({ length: firstDayIndex }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const selectedEvents = eventsByDate[selectedDate] ?? [];

  function moveMonth(direction: -1 | 1) {
    setVisibleMonth((current) => {
      const nextMonth = new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1,
      );
      return nextMonth;
    });
  }

  function showToday() {
    const today = new Date();
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Calendar</h1>
          <p className="mt-1 text-sm text-slate-600">
            Published and completed events in a monthly view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={showToday}
            className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-xl font-semibold text-slate-950">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          {weekdayNames.map((day) => (
            <div key={day} className="px-2 py-3">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarCells.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-28 border-b border-r border-slate-100 bg-slate-50/60"
                />
              );
            }

            const dateKey = toDateKey(new Date(year, month, day));
            const dayEvents = eventsByDate[dateKey] ?? [];
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDate;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`min-h-28 border-b border-r border-slate-100 p-2 text-left transition hover:bg-teal-50/60 ${
                  isSelected ? "bg-teal-50 ring-2 ring-inset ring-teal-500" : ""
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                    isToday
                      ? "bg-teal-700 text-white"
                      : "text-slate-800"
                  }`}
                >
                  {day}
                </span>

                <div className="mt-2 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <p
                      key={event.id}
                      className="truncate rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                      title={`${event.time} ${event.title}`}
                    >
                      {event.time} {event.title}
                    </p>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="px-2 text-xs font-medium text-teal-700">
                      +{dayEvents.length - 2} more
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          {formatDateHeader(selectedDate)}
        </h2>

        {selectedEvents.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No published events on this date.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {selectedEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {event.time} - {event.title}
                  </p>
                  <p className="text-slate-500">
                    {event.location} · {event.category}
                  </p>
                </div>
                <Link
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="w-fit text-sm font-medium text-teal-700 hover:text-teal-900"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
