import { createFileRoute } from "@tanstack/react-router";
import { CommercialPage } from "@/components/OpenLandPage";

export const Route = createFileRoute("/commercial")({
  head: () => ({
    meta: [
      { title: "Commercial | KSBaig Real Estate" },
      { name: "description", content: "Browse commercial property listings from KSBaig Real Estate." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CommercialPage,
});
