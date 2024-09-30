import { createLazyFileRoute } from "@tanstack/react-router";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { Button } from "~/components/ui";
import { useGetBlockByHeight } from "~/hooks";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

function Block() {
  const { blockNumber } = Route.useParams();
  const {
    data: latestBlock,
    isLoading,
    error,
  } = useGetBlockByHeight(blockNumber);

  let bn;
  if (blockNumber === "latest") bn = "latest";
  else if (parseInt(blockNumber)) bn = parseInt(blockNumber);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlock) return <p>No data</p>;

  const getBlockDetails = () => {
    return [
      { label: "Block Number", value: "" + latestBlock.height },
      { label: "Block Hash", value: latestBlock.hash },
      {
        label: "Timestamp",
        value:
          new Date(
            parseInt(latestBlock.header.globalVariables.timestamp, 16) * 1000,
          ).toLocaleString() + ` (${4} ago)`,
      },
      {
        label: "Num Txs",
        value: "" + parseInt(latestBlock.header.contentCommitment.numTxs, 16),
      },
      // TODO: what is good block header data to display?
      {
        label: "slotNumber",
        value: "" + parseInt(latestBlock.header.globalVariables.slotNumber, 16),
      },
      {
        label: "coinbase",
        value: "" + parseInt(latestBlock.header.globalVariables.coinbase, 16),
      },
      // TODO: stats on logs
      // TODO: better display of gas
      {
        label: "feeRecipient",
        value:
          "" + parseInt(latestBlock.header.globalVariables.feeRecipient, 16),
      },
      {
        label: "totalFees",
        value: "" + parseInt(latestBlock.header.totalFees, 16),
      },
      {
        label: "feePerDaGas",
        value:
          "" +
          parseInt(latestBlock.header.globalVariables.gasFees.feePerDaGas, 16),
      },
      {
        label: "feePerL2Gas",
        value:
          "" +
          parseInt(latestBlock.header.globalVariables.gasFees.feePerL2Gas, 16),
      },
    ];
  };

  const getTxEffects = () => {
    return latestBlock.body.txEffects.map((tx) => {
      console.log(tx.txHash);
      return {
        txHash: tx.txHash,
        transactionFee: Number(tx.transactionFee),
        logCount:
          tx.noteEncryptedLogs.functionLogs.length +
          tx.encryptedLogs.functionLogs.length +
          tx.unencryptedLogs.functionLogs.length,
      };
    });
  };

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      {bn ? (
        <div>
          <div>
            <h2>Block Details</h2>
            <p>{bn}</p>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay data={getBlockDetails()} />
            </div>
            <div className="flex flex-row gap-4 w-10 mb-4">
              <Button variant={"primary"}>
                <p>View Transactions</p>
              </Button>
              <Button variant={"primary"}>View Transactions</Button>
            </div>
            <TxEffectsTable txEffects={getTxEffects()} />
          </div>
        </div>
      ) : (
        <div>
          <h2>Invalid Block Number</h2>
          <p>Block {blockNumber} not found</p>
        </div>
      )}
    </div>
  );
}
