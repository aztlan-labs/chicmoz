import { createLazyFileRoute } from "@tanstack/react-router";
import { ContractClassDetails } from "~/pages/contract-class-details";

export const Route = createLazyFileRoute("/contracts/classes/$id/versions/$version")({
  component: ContractClassDetails,
});
