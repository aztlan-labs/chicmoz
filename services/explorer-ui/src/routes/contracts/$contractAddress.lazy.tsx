import { createLazyFileRoute } from "@tanstack/react-router";
import { ContractDetails } from "~/pages/contract-details";

export const Route = createLazyFileRoute("/contracts/$contractAddress")({
  component: ContractDetails,
});
