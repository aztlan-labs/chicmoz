import { ChicmozL2TxEffect } from "@chicmoz-pkg/types";
import { FC, useState } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { TxEffextDetailsDisplay } from "~/components/tx-effect-details-display";
import { Button } from "~/components/ui";
import { useGetTxEffectById } from "~/hooks/tx-effect";
import { getTxEffectData } from "./utils";
import { useParams } from "@tanstack/react-router";
import { type TabId, txEffectTabs } from "./constants";

export const TxEffectDetails: FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabId>("ecryptedLogs");
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
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          {selectedTab === "ecryptedLogs" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
          {selectedTab === "unencryptedLogs" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
          {selectedTab === "nullifiers" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
          {selectedTab === "noteEncryption" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
          {selectedTab === "noteHashes" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
          {selectedTab === "l2ToL1Msgs" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
          {selectedTab === "publicDataWrites" && (
            <div className="bg-white rounded-lg shadow-md p-4"></div>
          )}
        </div>
      </div>
    </div>
  );
};
