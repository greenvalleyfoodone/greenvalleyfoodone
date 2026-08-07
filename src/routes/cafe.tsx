import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Cafe";

export const Route = createFileRoute("/cafe")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Cafe — Filter Coffee & Bakes | Green Valley" },
      { name: "description", content: "Slow-brewed filter coffee, espresso, shakes and fresh bakes at the Green Valley cafe in Santhamaguluru." },
      { property: "og:title", content: "Cafe — Filter Coffee & Bakes | Green Valley" },
      { property: "og:description", content: "Slow-brewed filter coffee, espresso, shakes and fresh bakes at the Green Valley cafe in Santhamaguluru." },
    ],
  }),
});
