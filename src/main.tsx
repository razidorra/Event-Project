import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { EventsProvider } from "./context/EventsProvider";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// "auth: undefined!" is just a placeholder for the type system —
// the real value is supplied at render time via <RouterProvider context={...}>
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Small wrapper component: hooks like useAuth() only work inside components,
// so we can't call it directly in main.tsx at the top level.
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const auth = useAuth();

  // While Clerk is figuring out whether someone is signed in,
  // don't render any routes yet — otherwise beforeLoad would run with stale info
  if (!auth.isLoaded) {
    return <p>Loading...</p>;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <EventsProvider>
        <App />
      </EventsProvider>
    </ClerkProvider>
  </StrictMode>,
);
