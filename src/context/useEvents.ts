import { useContext } from "react";
import { EventsContext } from "./events-context";

// This file exports ONLY a hook function — also fine for Fast Refresh
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
