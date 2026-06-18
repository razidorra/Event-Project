# Event Board

Event Board is a small React application for managing events. It uses
TypeScript for safer code, TanStack Router for page routing, localStorage for
browser persistence, and Tailwind CSS for styling.

## Features

- Dashboard with event statistics and upcoming events
- Event overview with search, status filter, category filter, and sorting
- Detail page for each event
- Create, edit, and delete events
- Form validation for required fields and attendee capacity
- Calendar-style event list
- Data saved in the browser with localStorage

## Tech Stack

- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS v4
- ESLint

## Project Structure

```text
src/
  components/
    EventCard.tsx
  context/
    EventsProvider.tsx
    events-context.tsx
    useEvents.ts
  data/
    initialEvents.ts
  routes/
    __root.tsx
    index.tsx
    about.tsx
    calendar.tsx
    events/
      index.tsx
      new.tsx
      $eventId.tsx
      $eventId.edit.tsx
  types/
    event.ts
```

## Important Files

- `src/types/event.ts` defines the event, attendee, status, and category types.
- `src/context/EventsProvider.tsx` stores event data and exposes add, update,
  delete, and attendee actions.
- `src/routes/__root.tsx` contains the shared layout and navigation.
- `src/routes/index.tsx` renders the dashboard.
- `src/routes/events/index.tsx` renders the searchable and filterable event
  list.
- `src/routes/events/new.tsx` creates new events.
- `src/routes/events/$eventId.tsx` shows one event in detail.
- `src/routes/events/$eventId.edit.tsx` edits an existing event.

## How Data Works

The app starts with demo events from `src/data/initialEvents.ts`. After that,
events are saved to the browser under the localStorage key
`eventboard-events`. This means created or edited events remain available after
refreshing the page in the same browser.

## Routing

Routes are file-based through TanStack Router:

- `/` dashboard
- `/events` event overview
- `/events/new` create event
- `/events/$eventId` event detail page
- `/events/$eventId/edit` edit event page
- `/calendar` calendar overview
- `/about` project information

## Design Notes

The UI uses Tailwind utility classes with a restrained dashboard style:

- white content surfaces on a light slate background
- teal for primary actions and active navigation
- slate text for strong readability
- responsive grids for cards, filters, forms, and detail information
- consistent rounded corners, borders, shadows, and focus states

## Run The Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Check the project:

```bash
npm run lint
npm run build
```
