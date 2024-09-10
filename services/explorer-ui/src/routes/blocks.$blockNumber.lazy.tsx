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
      {bn ? <p>Block {bn}</p> : <p>Block not found</p>}
    </div>
  );
}
