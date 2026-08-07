import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Green Valley — Cafe & Restaurant in Santhamaguluru" },
      {
        name: "description",
        content:
          "Green Valley — a family-run cafe and restaurant in Santhamaguluru bringing authentic Andhra flavors and filter coffee, every day.",
      },
      { property: "og:title", content: "Green Valley — Cafe & Restaurant in Santhamaguluru" },
      {
        property: "og:description",
        content:
          "Authentic Andhra flavors, wood-fired grills and filter coffee in Santhamaguluru.",
      },
    ],
  }),
});
