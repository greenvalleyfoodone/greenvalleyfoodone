import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/About";

export const Route = createFileRoute("/about")({
  component: Page,
  head: () => ({
    meta: [
      { title: "About Us | Green Valley Cafe & Restaurant" },
      { name: "description", content: "The story behind Green Valley — a family-run cafe and restaurant serving Santhamaguluru." },
      { property: "og:title", content: "About Us | Green Valley Cafe & Restaurant" },
      { property: "og:description", content: "The story behind Green Valley — a family-run cafe and restaurant serving Santhamaguluru." },
    ],
  }),
});
