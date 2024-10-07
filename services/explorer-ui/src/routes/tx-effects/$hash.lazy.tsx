import { createLazyFileRoute } from "@tanstack/react-router";
import { TxEffectDetails } from "~/pages/tx-effect-details";

export const Route = createLazyFileRoute("/tx-effects/$hash")({
  component: TxEffectDetails,
});
