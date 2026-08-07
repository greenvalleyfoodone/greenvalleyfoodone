import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Restaurant";

export const Route = createFileRoute("/restaurant")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Restaurant — Andhra Kitchen | Green Valley" },
      { name: "description", content: "Authentic Andhra meals, biryanis and tandoor grills served daily at the Green Valley restaurant." },
      { property: "og:title", content: "Restaurant — Andhra Kitchen | Green Valley" },
      { property: "og:description", content: "Authentic Andhra meals, biryanis and tandoor grills served daily at the Green Valley restaurant." },
    ],
  }),
});
