import { createLazyFileRoute } from "@tanstack/react-router";
import { TxEffectDetails } from "~/pages/tx-effect-details";

export const Route = createLazyFileRoute("/transactions/$transactionId")({
  component: TxEffectDetails,
});
