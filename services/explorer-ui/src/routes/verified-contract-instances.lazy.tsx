import { createLazyFileRoute } from "@tanstack/react-router";
import { VerifiedContractInstances } from "~/pages/verified-contract-instances";

export const Route = createLazyFileRoute("/verified-contract-instances")({
  component: VerifiedContractInstances,
});
