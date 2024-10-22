import { createLazyFileRoute } from "@tanstack/react-router";
import { PrivacyPolicy } from "~/pages/privacy-policy";

export const Route = createLazyFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
});
