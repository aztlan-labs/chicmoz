import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

function Block() {
  const { blockNumber } = Route.useParams();
  console.log("blockNumber", blockNumber);

  let bn;
  if (blockNumber === "latest") bn = "latest";
  else if (parseInt(blockNumber)) bn = parseInt(blockNumber);

  return (
    <div className="bg-card p-4">
      {bn ? (
        <div>
          <h2>Block "{bn}"</h2>
          <p>Block details here</p>
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
