import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Contact & Location | Green Valley" },
      { name: "description", content: "Find Green Valley in Santhamaguluru — address, phone, timings and directions." },
      { property: "og:title", content: "Contact & Location | Green Valley" },
      { property: "og:description", content: "Find Green Valley in Santhamaguluru — address, phone, timings and directions." },
    ],
  }),
});
