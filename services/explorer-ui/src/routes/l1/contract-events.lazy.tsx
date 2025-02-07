import { createLazyFileRoute } from "@tanstack/react-router";
import { ContractEventsPage } from "~/pages/l1/contract-events";

export const Route = createLazyFileRoute("/l1/contract-events")({
  component: ContractEventsPage,
});
