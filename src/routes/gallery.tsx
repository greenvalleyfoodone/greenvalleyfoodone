import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Gallery";

export const Route = createFileRoute("/gallery")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Gallery | Green Valley Cafe & Restaurant" },
      { name: "description", content: "Photos of the Green Valley cafe, restaurant, dishes and celebrations in Santhamaguluru." },
      { property: "og:title", content: "Gallery | Green Valley Cafe & Restaurant" },
      { property: "og:description", content: "Photos of the Green Valley cafe, restaurant, dishes and celebrations in Santhamaguluru." },
    ],
  }),
});
