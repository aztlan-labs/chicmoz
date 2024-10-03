import { FC, useState } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { Button } from "~/components/ui";
import { useGetTxEffectByHash } from "~/hooks/";
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
  } = useGetTxEffectByHash(transactionId);

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
                variant="primary"
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            {selectedTab === "ecryptedLogs" && (
              <div className="">
                {txEffects.encryptedLogs.functionLogs.map(
                  (encryption, index) => {
                    const entries = encryption.logs.map((log) => {
                      return Object.entries(log).map(([key, value]) => ({
                        label: key,
                        value: value,
                        isClickable: false,
                      }));
                    });
                    // Flatten the nested arrays
                    const flattenedEntries = entries.flat();

                    // Render KeyValueDisplay with the flattened entries
                    return (
                      <div key={index}>
                        <h3>Log {index + 1}</h3>
                        <KeyValueDisplay key={index} data={flattenedEntries} />
                      </div>
                    );
                  },
                )}
              </div>
            )}
            {selectedTab === "unencryptedLogs" && (
              <div className="">
                {txEffects.nullifiers.map((nullifier) => (
                  <KeyValueDisplay
                    data={[{ label: "Nullifier", value: nullifier }]}
                  />
                ))}
              </div>
            )}
            {selectedTab === "nullifiers" && (
              <div className="">
                {txEffects.nullifiers.map((nullifier) => (
                  <KeyValueDisplay
                    data={[{ label: "Nullifier", value: nullifier }]}
                  />
                ))}
              </div>
            )}
            {selectedTab === "noteEncryption" && (
              <div className="flex flex-col gap-4 w-10 mb-4">
                {txEffects.noteEncryptedLogs.functionLogs.map(
                  (noteEncryption, index) => {
                    const entries = noteEncryption.logs.map((log) => {
                      return Object.entries(log).map(([key, value]) => ({
                        label: key,
                        value: value,
                        isClickable: false,
                      }));
                    });
                    // Flatten the nested arrays
                    const flattenedEntries = entries.flat();

                    // Render KeyValueDisplay with the flattened entries
                    return (
                      <div key={index}>
                        <h3>Log {index + 1}</h3>
                        <KeyValueDisplay key={index} data={flattenedEntries} />
                      </div>
                    );
                  },
                )}
              </div>
            )}
            {selectedTab === "noteHashes" && (
              <div className="">
                {txEffects.noteHashes.map((nullifier) => (
                  <KeyValueDisplay
                    data={[{ label: "Note Hashes", value: nullifier }]}
                  />
                ))}
              </div>
            )}
            {selectedTab === "l2ToL1Msgs" && (
              <div className="">
                {txEffects.l2ToL1Msgs.map((nullifier) => (
                  <KeyValueDisplay
                    data={[{ label: "L2 to L1 Messages", value: nullifier }]}
                  />
                ))}
              </div>
            )}
            {selectedTab === "publicDataWrites" && (
              <div className="flex flex-col gap-19 w-auto mb-4">
                {txEffects.publicDataWrites.map((publicDataWrite, index) => (
                  <div key={index}>
                    <h4>Log {index + 1}</h4>
                    <KeyValueDisplay
                      data={[
                        {
                          label: "leafIndex",
                          value: publicDataWrite.leafIndex,
                          isClickable: false,
                        },
                        {
                          label: "newValue",
                          value: publicDataWrite.newValue,
                          isClickable: false,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
