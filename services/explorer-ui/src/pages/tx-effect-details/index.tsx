import { ChicmozL2TxEffect } from "@chicmoz-pkg/types";
import { FC, useState } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { TxEffextDetailsDisplay } from "~/components/tx-effect-details-display";
import { Button } from "~/components/ui";
import { useGetTxEffectById } from "~/hooks/tx-effect";
import { getTxEffectData } from "./utils";
import { useParams } from "@tanstack/react-router";
import { TabId, txEffectTabs } from "./constants";

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

export const TxEffectDetails: FC = () => {
  const [selectedButton, setSelectedButton] = useState<TabId>("ecryptedLogs");
  const { transactionId } = useParams({
    from: "/transactions/$transactionId",
  });
  const {
    data: txEffects,
    isLoading,
    error,
  } = useGetTxEffectById(transactionId);

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
            {txEffectTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={"primary"}
                onClick={() => setSelectedButton(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          {selectedButton === "ecryptedLogs" && (
            <TxEffextDetailsDisplay
              title="Transaction effects"
              details={["Encrypted logs", "Unencrypted logs"]}
            />
          )}
          {selectedButton === "unencryptedLogs" && (
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
};
