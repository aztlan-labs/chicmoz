import { createLazyFileRoute } from "@tanstack/react-router";
import { TransactionsTable } from "~/components/transactions/transactions-table";
import { Button } from "~/components/ui";
import { useLatestBlock } from "~/hooks/useLatestBlock";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

function Block() {
  const { mockedChicmozL2Block, loading, error, timeSince } = useLatestBlock();
  const { blockNumber } = Route.useParams();

  const latestBlockData = mockedChicmozL2Block;
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
        <div className="">
          <div className="bg-white p-6 rounded-lg shadow-md mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Block Data</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {latestBlockData && (
              <>
                <div>
                  <p>
                    <strong>Block Number:</strong>{" "}
                    {parseInt(
                      latestBlockData.header.globalVariables.blockNumber,
                      16,
                    )}
                  </p>
                  <p>
                    <strong>Time since:</strong> {timeSince}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-row gap-4 w-10 mb-4">
            <Button variant={"primary"}>View Transactions</Button>
            <Button variant={"primary"}>View Transactions</Button>
          </div>
          <TransactionsTable />
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
