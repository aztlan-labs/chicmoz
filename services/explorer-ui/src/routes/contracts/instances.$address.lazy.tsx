import { createLazyFileRoute } from "@tanstack/react-router";
import { ContractInstanceDetails } from "~/pages/contracts/instance-details";

export const Route = createLazyFileRoute("/contracts/instances/$address")({
  component: ContractInstanceDetails,
});