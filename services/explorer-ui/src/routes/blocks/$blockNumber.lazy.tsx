import { createLazyFileRoute } from "@tanstack/react-router";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { TransactionsTable } from "~/components/transactions/transactions-table";
import { Button } from "~/components/ui";
import { useLatestBlock } from "~/hooks/useLatestBlock";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

const blockData = [
  { label: "BLOCK NUMBER", value: "348540" },
  {
    label: "BLOCK HASH",
    value:
      "0x995542b01a706c56d3a962ba819e765ree057egtr4311562cdf6286147fbf9cf51",
  },
  { label: "STATUS", value: "FINALISED" },
  { label: "TIMESTAMP", value: "1 min ago (Jun-07-2024 08:47:23 AM UTC)" },
  { label: "TRANSACTIONS", value: "155 transactions" },
  { label: "TOTAL FEES", value: "0.000122453 ETH ($0.05)" },
  { label: "SIZE", value: "46,377 bytes" },
  { label: "LOGS", value: "323 logs" },
  {
    label: "PARENT HASH",
    value: "0xebe7fuy7655b6506fe587hj7c2ad1237b242b9adc60ci8u7y972728ce63b526b",
  },
];

function Block() {
  const { mockedChicmozL2Block, loading, error, timeSince } = useLatestBlock();
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
              <KeyValueDisplay data={blockData} />
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
