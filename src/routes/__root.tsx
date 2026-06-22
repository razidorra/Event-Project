import {
  createRootRouteWithContext,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { Show, UserButton } from "@clerk/react";
import type { useAuth } from "@clerk/react";

export type RouterContext = {
  auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <nav className="flex gap-4">
          <Link to="/" className="[&.active]:font-bold">
            Dashboard
          </Link>
          <Link to="/events" className="[&.active]:font-bold">
            Events
          </Link>
          <Link to="/calendar" className="[&.active]:font-bold">
            Calendar
          </Link>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </nav>

        {/* Only renders the avatar/menu (which includes "Sign out") when someone is signed in */}
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
