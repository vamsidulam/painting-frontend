import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

// Splat route: every non-root URL renders the React Router-powered App,
// which then matches the path internally via react-router-dom.
export const Route = createFileRoute("/$")({
  component: App,
});
