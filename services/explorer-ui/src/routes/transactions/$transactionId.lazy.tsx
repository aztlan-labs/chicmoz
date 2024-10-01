import { ChicmozL2TxEffect } from "@chicmoz-pkg/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { TxEffextDetailsDisplay } from "~/components/tx-effect-details-display";
import { Button } from "~/components/ui";
import { useGetTxEffectById } from "~/hooks/tx-effect";

export const Route = createLazyFileRoute("/transactions/$transactionId")({
  component: TransactionDetails,
});

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
  const {
    data: txEffects,
    isLoading,
    error,
  } = useGetTxEffectById(transactionId);

  const getTxEffectData = (data: ChicmozL2TxEffect) => [
    {
      label: "HASH",
      value: data.txHash,
      isClickable: true,
    },
    { label: "STATUS", value: "SUCCESS" },
    {
      label: "TRANSACTION FEE",
      value: data.transactionFee,
      isClickable: true,
    },
    //TODO: get actual Block number and time stamp
    { label: "BLOCK NUMBER", value: "-1" },
    { label: "TIMESTAMP", value: "-1" },
  ];

  if (!transactionId) <div> No transaction id</div>;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!txEffects) return <div>No data</div>;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div>
        <div>
          <h2>Transaction details</h2>
          <p>{txEffects.txHash}</p>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getTxEffectData(txEffects)} />
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
            <TxEffextDetailsDisplay
              title="Transaction effects"
              details={txEffects.effects}
            />
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
    </div>
  );
}
