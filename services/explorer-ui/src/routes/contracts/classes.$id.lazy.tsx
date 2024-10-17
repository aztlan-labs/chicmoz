import { createLazyFileRoute } from "@tanstack/react-router";
import { ContractClassDetails } from "~/pages/contracts-class-details";

export const Route = createLazyFileRoute("/contracts/classes/$id")({
  component: ContractClassDetails,
});
