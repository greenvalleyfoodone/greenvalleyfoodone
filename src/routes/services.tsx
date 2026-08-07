import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/services";

export const Route = createFileRoute("/services")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Services & Events | Green Valley" },
      { name: "description", content: "Party hall, catering, birthdays and family events hosted by Green Valley in Santhamaguluru." },
      { property: "og:title", content: "Services & Events | Green Valley" },
      { property: "og:description", content: "Party hall, catering, birthdays and family events hosted by Green Valley in Santhamaguluru." },
    ],
  }),
});
