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
  else bn = blockNumber;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlock) return <p>No data</p>;

  const timestamp = latestBlock.header.globalVariables.timestamp;
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
        value: "" + latestBlock.header.contentCommitment.numTxs,
      },
      // TODO: what is good block header data to display?
      {
        label: "slotNumber",
        value: "" + latestBlock.header.globalVariables.slotNumber,
      },
      {
        label: "coinbase",
        value: "" + latestBlock.header.globalVariables.coinbase,
      },
      // TODO: stats on logs
      // TODO: better display of gas
      {
        label: "feeRecipient",
        value: "" + latestBlock.header.globalVariables.feeRecipient,
      },
      {
        label: "totalFees",
        value: "" + latestBlock.header.totalFees,
      },
      {
        label: "feePerDaGas",
        value: "" + latestBlock.header.globalVariables.gasFees.feePerDaGas,
      },
      {
        label: "feePerL2Gas",
        value: "" + latestBlock.header.globalVariables.gasFees.feePerL2Gas,
      },
    ];
  };

  const getTxEffects = () => {
    return latestBlock.body.txEffects.map((tx) => {
      return txEffectSchema.parse({
        blockNumber: latestBlock.height,
        timestamp: latestBlock.header.globalVariables.timestamp,
        hash: tx.hash,
        transactionFee: Number(tx.transactionFee),
        logCount:
          tx.encryptedLogsLength +
          tx.unencryptedLogsLength +
          tx.noteEncryptedLogsLength,
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
              <Button variant={"default"}>
                <p>View TxEffects</p>
              </Button>
              <Button variant={"default"}>View TxEffects</Button>
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
