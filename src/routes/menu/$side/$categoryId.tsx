import { createFileRoute } from "@tanstack/react-router";
import CategoryDetail from "@/pages/CategoryDetail";

export const Route = createFileRoute("/menu/$side/$categoryId")({
  component: CategoryDetail,
  head: () => ({
    meta: [
      { title: "Menu Category — Green Valley" },
      { name: "description", content: "Dishes, drinks and prices for this Green Valley menu category." },
      { property: "og:title", content: "Menu Category — Green Valley" },
      { property: "og:description", content: "Dishes, drinks and prices for this Green Valley menu category." },
    ],
  }),
});
