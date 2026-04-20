import { createFileRoute } from "@tanstack/react-router";

// Splat route: every non-root path falls through to the React Router app
// rendered by __root.tsx (App is mounted as the root component).
export const Route = createFileRoute("/$")({
  component: () => null,
});
