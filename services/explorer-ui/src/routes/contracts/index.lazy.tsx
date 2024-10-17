import { createLazyFileRoute } from "@tanstack/react-router";
import { Contracts } from "~/pages/contracts";

export const Route = createLazyFileRoute("/contracts/")({
  component: Contracts,
});
