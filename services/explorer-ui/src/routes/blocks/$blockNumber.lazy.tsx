import { createLazyFileRoute } from "@tanstack/react-router";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { txEffectSchema } from "~/components/tx-effects/tx-effects-schema";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { Button } from "~/components/ui";
import { useGetBlockByHeight } from "~/hooks";
import { formatTimeSince } from "~/lib/utils";
import { API_URL, aztecExplorer } from "~/service/constants";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

const API_ENDPOINT_URL = `${API_URL}/${aztecExplorer.getL2BlockByHash}`;

function Block() {
  const { blockNumber } = Route.useParams();
  const {
    data: latestBlock,
    isLoading,
    error,
  } = useGetBlockByHeight(blockNumber);

  let bn;
  if (blockNumber === "latest") bn = "latest";
  else if (blockNumber.startsWith("0x00")) bn = parseInt(blockNumber, 16);
  // NOTE: ugly hack because we also allow hash as ID
  else bn = blockNumber;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlock) return <p>No data</p>;

  const timestamp =
    parseInt(latestBlock.header.globalVariables.timestamp, 16) * 1000;
  const timeSince = formatTimeSince(timestamp);
  const getBlockDetails = () => {
    return [
      { label: "Block Number", value: "" + latestBlock.height },
      { label: "Block Hash", value: latestBlock.hash },
      {
        label: "Timestamp",
        value: new Date(timestamp).toLocaleString() + ` (${timeSince})`,
      },
      {
        // NOTE: this is not the same as txEffects.length!
        label: "Number of transactions",
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
      return txEffectSchema.parse({
        blockNumber: latestBlock.height,
        timestamp:
          parseInt(latestBlock.header.globalVariables.timestamp, 16) * 1000,
        txHash: tx.txHash,
        transactionFee: Number(tx.transactionFee),
        logCount:
          parseInt(tx.encryptedLogsLength, 16) +
          parseInt(tx.unencryptedLogsLength, 16) +
          parseInt(tx.noteEncryptedLogsLength, 16),
      });
    });
  };

  const apiEndpointUrl = `${API_ENDPOINT_URL}${bn}`;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      {bn ? (
        <div>
          <div>
            <h2>Block Details</h2>
            <p>{bn}</p>
            <a href={apiEndpointUrl} target="_blank" rel="noreferrer">
              (API Endpoint)
            </a>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay data={getBlockDetails()} />
            </div>
            <div className="flex flex-row gap-4 w-10 mb-4">
              <Button variant={"primary"}>
                <p>View TxEffects</p>
              </Button>
              <Button variant={"primary"}>View TxEffects</Button>
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
