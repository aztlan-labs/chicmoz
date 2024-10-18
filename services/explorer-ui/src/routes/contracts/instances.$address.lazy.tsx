import { createLazyFileRoute } from "@tanstack/react-router";
import { ContractInstanceDetails } from "~/pages/contract-instance-details";

export const Route = createLazyFileRoute("/contracts/instances/$address")({
  component: ContractInstanceDetails,
});
