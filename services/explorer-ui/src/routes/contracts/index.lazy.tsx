import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { txEffectSchema } from "~/components/tx-effects/tx-effects-schema";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { useLatestBlocks } from "~/hooks";

export const Route = createLazyFileRoute("/contracts/")({
  component: TxEffects,
});

function TxEffects() {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();
  let isIndex = true;
  try {
    const params = useParams({ from: "/tx-effects/$txHash" });
    isIndex = !params.txHash;
  } catch (e) {
    console.error(e);
    isIndex = true;
  }
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  const latestTxEffects = latestBlocks?.flatMap((block) => {
    return block.body.txEffects.map((txEffect) =>
      txEffectSchema.parse({
        txHash: txEffect.txHash,
        transactionFee: parseInt(txEffect.transactionFee, 16),
        logCount:
          parseInt(txEffect.encryptedLogsLength, 16) +
          parseInt(txEffect.unencryptedLogsLength, 16) +
          parseInt(txEffect.noteEncryptedLogsLength, 16),
        blockNumber: block.height,
        timestamp: parseInt(block.header.globalVariables.timestamp, 16) * 1000,
      })
    );
  });
  if (!latestTxEffects) return <p>No data</p>;

  const text = {
    title: isIndex ? "All TxEffects" : "TxEffect Details",
  };
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      <div className="flex flex-row gap-4 m-8">
        <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
          <p> TxEffects in the last 24 hours</p>
          <h2 className="text-primary">TODO</h2>
        </div>

        <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
          <p>Pending txEffects in last hour</p>
          <h2 className="text-primary">TODO</h2>
        </div>
      </div>
      {isIndex ? <TxEffectsTable txEffects={latestTxEffects} /> : <Outlet />}
    </div>
  );
}
