import { createFileRoute } from "@tanstack/react-router";
import { TermsAndCondtions } from "~/pages/terms-and-conditions";

export const Route = createFileRoute("/terms-and-conditions")({
  component: TermsAndCondtions,
});
