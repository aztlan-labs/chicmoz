import { createLazyFileRoute } from "@tanstack/react-router";
import { VerifiedContracts } from "~/pages/verified-contracts";

export const Route = createLazyFileRoute("/verified-contracts")({
  component: VerifiedContracts,
});
