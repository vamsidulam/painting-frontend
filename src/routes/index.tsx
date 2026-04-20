import { createFileRoute } from "@tanstack/react-router";

// All routing is handled by react-router-dom inside src/App.tsx.
// This file exists only to satisfy the TanStack Router file-based routing bootstrap.
export const Route = createFileRoute("/")({
  component: () => null,
});
