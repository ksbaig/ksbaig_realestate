import { createFileRoute } from "@tanstack/react-router";
import { FileMergingPage } from "@/components/OpenLandPage";

export const Route = createFileRoute("/file-merging")({
  head: () => ({
    meta: [
      { title: "File Merging | KSBaig Real Estate" },
      { name: "description", content: "Browse file merging listings from KSBaig Real Estate." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FileMergingPage,
});
