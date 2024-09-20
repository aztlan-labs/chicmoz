import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { Button } from "~/components/ui";

export const Route = createLazyFileRoute("/transactions/$transactionId")({
  component: TransactionDetails,
});

const transactionData = [
  {
    label: "HASH",
    value: "0xb950b8ba84a4f35f85d5f62a0e3f8b161d8733479c14d426dc36ae30f7e96246",
    isClickable: true,
  },
  { label: "STATUS", value: "SUCCESS" },
  {
    label: "BLOCK NUMBER",
    value: "348540 (confirmed by sequencer)",
    isClickable: true,
  },
  { label: "TIMESTAMP", value: "1 min ago (Jun-07-2024 08:47:23 AM UTC)" },
  {
    label: "L1 BATCH TX",
    value: "0xb950b8ba84a4f35f85d5f62a0e3f8b161d8733479c14d426dc36ae30f7e92341",
    isClickable: true,
  },
  { label: "TRANSACTION FEE", value: "0.000012245344159887766 ETH ($0.05)" },
];

const feeData = [
  { label: "TRANSACTION FEE", value: "0.000012453 ETH" },
  { label: "FPA USED", value: "ETHER" },
  { label: "GAS PRICE", value: "0.000012453 ETH" },
  { label: "GAS", value: "0.000012453 ETH" },
  { label: "FEE USED FOR L2 GAS", value: "0.000012453 ETH" },
  { label: "L1 GAS", value: "0.000012453 ETH" },
  { label: "DATA AVAILABILITY FEE", value: "0.000012453 ETH" },
  { label: "COINBASE", value: "0.000012453 ETH" },
  {
    label: "FEE RECIPIENT",
    value: "0xb950b8ba84a4f35f85d5f62a0e3f8b161d8733479c14d426dc36ae30f7e96246",
    isClickable: true,
  },
];

function TransactionDetails() {
  const [selectedButton, setSelectedButton] = useState("transactionEffects");
  const { transactionId } = Route.useParams();

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      {transactionId ? (
        <div>
          <div>
            <h2>Transaction details</h2>
            <p>{transactionId}</p>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay data={transactionData} />
            </div>
            <div className="flex flex-row gap-4 w-10 mb-4">
              <Button
                variant={"primary"}
                onClick={() => setSelectedButton("transactionEffects")}
              >
                Transaction effects
              </Button>
              <Button
                variant={"primary"}
                onClick={() => setSelectedButton("feeDetails")}
              >
                View Transactions
              </Button>
            </div>
            {selectedButton === "transactionEffects" && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3>Transaction Effects</h3>
              </div>
            )}
            {selectedButton === "feeDetails" && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col mt-8">
                  <h3>Fee Details</h3>
                  <KeyValueDisplay data={feeData} />
                </div>
                <div className="flex flex-col mt-8">
                  <h3>Public fee Details</h3>
                  <KeyValueDisplay data={feeData} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        //TODO: create reusable component
        <div>
          <h2>Invalid Transaction Id</h2>
          <p>transaction {transactionId} not found</p>
        </div>
      )}
    </div>
  );
}
