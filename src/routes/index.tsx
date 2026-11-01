import { createFileRoute } from "@tanstack/react-router";
import { ScopeApp } from "@/features/scope/ScopeApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HYNT Scope Compass — Plan Your Renovation" },
      { name: "description", content: "Room-by-room scope brief, realistic budget and audited quotes for your home renovation." },
      { property: "og:title", content: "HYNT Scope Compass — Plan Your Renovation" },
      { property: "og:description", content: "Room-by-room scope brief, realistic budget and audited quotes for your home renovation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScopeApp,
});
