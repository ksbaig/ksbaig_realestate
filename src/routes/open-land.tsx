import { createFileRoute } from "@tanstack/react-router";
import { OpenLandPage } from "@/components/OpenLandPage";

export const Route = createFileRoute("/open-land")({
  head: () => ({
    meta: [
      { title: "Open Land | KSBaig Real Estate" },
      { name: "description", content: "Browse open land and plots from KSBaig Real Estate." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OpenLandPage,
});
