import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { EventsProvider } from "./context/EventsProvider";
import "./index.css";

// routeTree.gen.ts is auto-generated and contains every route
// the plugin found inside src/routes/
const router = createRouter({ routeTree });

// Tells TypeScript which router type is in use, so e.g. "to" on <Link>
// only suggests/accepts valid routes
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* EventsProvider must wrap the router so every page can access
        the same localStorage-backed data via useEvents() */}
    <EventsProvider>
      <RouterProvider router={router} />
    </EventsProvider>
  </StrictMode>,
);
