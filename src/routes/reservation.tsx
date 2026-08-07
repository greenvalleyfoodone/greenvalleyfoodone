import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Reservation";

export const Route = createFileRoute("/reservation")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Reserve a Table | Green Valley" },
      { name: "description", content: "Book a table at Green Valley cafe and restaurant in Santhamaguluru." },
      { property: "og:title", content: "Reserve a Table | Green Valley" },
      { property: "og:description", content: "Book a table at Green Valley cafe and restaurant in Santhamaguluru." },
    ],
  }),
});
