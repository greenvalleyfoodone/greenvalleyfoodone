import { createFileRoute } from "@tanstack/react-router";
import Menu from "@/pages/Menu";

export const Route = createFileRoute("/menu/$side/")({
  component: Menu,
  head: () => ({
    meta: [
      { title: "Menu Categories — Green Valley" },
      { name: "description", content: "Explore Green Valley menu categories by cafe and restaurant side." },
      { property: "og:title", content: "Menu Categories — Green Valley" },
      { property: "og:description", content: "Explore Green Valley menu categories by cafe and restaurant side." },
    ],
  }),
});
