import { createFileRoute } from "@tanstack/react-router";
import Menu from "@/pages/Menu";

export const Route = createFileRoute("/menu/")({
  component: Menu,
  head: () => ({
    meta: [
      { title: "Menu — Green Valley Cafe & Restaurant" },
      { name: "description", content: "Browse the Green Valley menu: cafe brews, Andhra meals, tandoor, biryanis and desserts." },
      { property: "og:title", content: "Menu — Green Valley Cafe & Restaurant" },
      { property: "og:description", content: "Browse the Green Valley menu: cafe brews, Andhra meals, tandoor, biryanis and desserts." },
    ],
  }),
});
