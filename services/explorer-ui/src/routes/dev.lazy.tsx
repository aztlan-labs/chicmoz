import { createLazyFileRoute } from "@tanstack/react-router";
import { DevPage } from "~/pages/dev";

export const Route = createLazyFileRoute("/dev")({
  component: DevPage,
});
