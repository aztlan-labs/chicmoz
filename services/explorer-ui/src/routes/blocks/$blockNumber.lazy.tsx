import { createLazyFileRoute } from "@tanstack/react-router";
import {
  DetailItem,
  KeyValueDisplay,
} from "~/components/info-display/key-value-display";
import { TransactionsTable } from "~/components/transactions/transactions-table";
import { Button } from "~/components/ui";
import { useLatestBlock } from "~/hooks/useLatestBlock";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

function Block() {
  const { latestBlockData, loading, error, timeSince } = useLatestBlock();
  const { blockNumber } = Route.useParams();

  // TODO: these messages should perhaps be diplayed?
  // console.log("Extracted messages:");
  // const txEffects = latestBlockData?.body.txEffects;
  // if (txEffects && txEffects.length > 0) {
  //   for (let i = 0; i < txEffects.length; i++) {
  //     const functionLogs = txEffects[i]?.unencryptedLogs.functionLogs;
  //     if (functionLogs && functionLogs.length > 0) {
  //       for (let j = 0; j < functionLogs.length; j++) {
  //         const logs = functionLogs[j]?.logs;
  //         if (logs && logs.length > 0) {
  //           for (let k = 0; k < logs.length; k++) {
  //             const cleanedMessage = Buffer.from(logs[k].data, "hex")
  //               .toString("utf8")
  //               .split("")
  //               .filter((char) => char.charCodeAt(0) > 31)
  //               .join("");
  //             console.log(`[${i}][${j}][${k}]: ${cleanedMessage}`);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  let bn;
  if (blockNumber === "latest") bn = "latest";
  else if (parseInt(blockNumber)) bn = parseInt(blockNumber);

  let keyValues: DetailItem[] = [];
  if (latestBlockData) {
    keyValues = [
      { label: "Block Number", value: "" + latestBlockData.height },
      { label: "Block Hash", value: latestBlockData.hash },
      {
        label: "Timestamp",
        value: new Date(
          parseInt(latestBlockData.header.globalVariables.timestamp, 16) * 1000
        ).toLocaleString() + ` (${timeSince} ago)`,
      },
      {
        // TODO: this should be a link to txs list
        label: "Num Txs",
        value:
          "" + parseInt(latestBlockData.header.contentCommitment.numTxs, 16),
      },
      // TODO: what is good block header data to display?
      { label: "slotNumber", value: '' + parseInt(latestBlockData.header.globalVariables.slotNumber, 16) },
      { label: "coinbase", value: '' + parseInt(latestBlockData.header.globalVariables.coinbase, 16) },
      // TODO: stats on logs
      // TODO: better display of gas
      { label: "feeRecipient", value: '' + parseInt(latestBlockData.header.globalVariables.feeRecipient, 16) },
      { label: "totalFees", value: '' + parseInt(latestBlockData.header.totalFees, 16) },
      { label: "gasUsed", value: '' + parseInt(latestBlockData.header.globalVariables.gasFees.feePerDaGas, 16) },
      { label: "gasLimit", value: '' + parseInt(latestBlockData.header.globalVariables.gasFees.feePerL2Gas, 16) },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderList = (items: any[], maxItems = 10) => {
    const displayItems = items.slice(0, maxItems);
    return (
      <ul className="list-disc list-inside pl-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {displayItems.map((item: any, index: number) => (
          <li key={index}>
            {typeof item === "object" ? (
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto max-h-40">
                <code>{JSON.stringify(item, null, 2)}</code>
              </pre>
            ) : (
              item
            )}
          </li>
        ))}
        {items.length > maxItems && (
          <li>...and {items.length - maxItems} more</li>
        )}
      </ul>
    );
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
              <KeyValueDisplay data={keyValues} />
            </div>
            <div className="flex flex-row gap-4 w-10 mb-4">
              <Button variant={"primary"}>
                <p>View Transactions</p>
              </Button>
              <Button variant={"primary"}>View Transactions</Button>
            </div>
            <TransactionsTable />
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
