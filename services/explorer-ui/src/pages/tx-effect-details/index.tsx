import { useParams } from "@tanstack/react-router";
import { useState, type FC, useEffect } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useGetTxEffectByHash } from "~/hooks/";
import { txEffectTabs, type TabId } from "./constants";
import { getTxEffectData, mapTxEffectsData } from "./utils";
import { Textarea } from "~/components/ui/textarea";
import { OptionButtons } from "./tabs";

export const TxEffectDetails: FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabId>("encryptedLogs");
  const { hash } = useParams({
    from: "/tx-effects/$hash",
  });
  const { data: txEffects, isLoading, error } = useGetTxEffectByHash(hash);
  console.log(txEffects);
  const txEffectData = mapTxEffectsData(txEffects);

  useEffect(() => {
    // check for the first avalible tab with data
    if (txEffects) {
      const firstAvailableTab = txEffectTabs.find(
        (tab) => tab.id in txEffectData,
      );

      if (firstAvailableTab) setSelectedTab(firstAvailableTab.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txEffects]);

  const getSelectedItem = (value: string) => {
    setSelectedTab(value as TabId);
  };

  if (!hash) <div> No txEffect hash</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!txEffects) return <div>No data</div>;

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div>
          <h2>TxEffect details</h2>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getTxEffectData(txEffects)} />
          </div>
          <OptionButtons
            key={selectedTab}
            availableData={txEffectData}
            requiredOptions={txEffectTabs}
            onOptionSelect={getSelectedItem}
            selectedItem={selectedTab}
          />
          <div className="bg-white rounded-lg shadow-md p-4">
            {selectedTab === "encryptedLogs" && (
              <div className="">
                {txEffects.encryptedLogs.functionLogs.map(
                  (encryption, index) => {
                    const entries = encryption.logs.map((log) => {
                      return Object.entries(log).map(([key, value]) => {
                        return {
                          label: key,
                          value: value,
                          isClickable: false,
                        };
                      });
                    });
                    // Flatten the nested arrays
                    const flattenedEntries = entries.flat();

                    // Render KeyValueDisplay with the flattened entries
                    return (
                      <div key={index}>
                        <h4>Log {index + 1}</h4>
                        <KeyValueDisplay key={index} data={flattenedEntries} />
                      </div>
                    );
                  },
                )}
              </div>
            )}
            {selectedTab === "unencryptedLogs" && (
              <div className="">
                {txEffects.unencryptedLogs.functionLogs.map(
                  (unencrypted, index) => {
                    const entries = unencrypted.logs.map(
                      ({ data, contractAddress }) => {
                        return [
                          {
                            label: "Data",
                            value:
                              data
                                .match(/.{1,64}/g)
                                ?.map((hex) => parseInt(hex, 16))
                                .map((charCode) =>
                                  String.fromCharCode(charCode),
                                )
                                .join("") ?? "",
                            isClickable: false,
                          },
                          {
                            label: "Contract Address",
                            value: contractAddress,
                            isClickable: true,
                          },
                        ];
                      },
                    );
                    // Flatten the nested arrays
                    const flattenedEntries = entries.flat();

                    // Render KeyValueDisplay with the flattened entries
                    return (
                      <div key={index}>
                        <h4>Log {index + 1}</h4>
                        {flattenedEntries.map((entry) => (
                          <div key={entry.label}>
                            <a>{entry.label}</a>
                            <Textarea value={entry.value} disabled />
                          </div>
                        ))}
                      </div>
                    );
                  },
                )}
              </div>
            )}
            {selectedTab === "nullifiers" && (
              <div className="">
                {txEffects.nullifiers.map((nullifier, key) => (
                  <KeyValueDisplay
                    key={key}
                    data={[{ label: "Nullifier", value: nullifier }]}
                  />
                ))}
              </div>
            )}
            {selectedTab === "noteEncryptedLogs" && (
              <div className="">
                {txEffects.noteEncryptedLogs.functionLogs.map(
                  (noteEncryptedLogs, index) => {
                    const entries = noteEncryptedLogs.logs.map((log) => {
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
                        <h4>Log {index + 1}</h4>
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
                    <h4>Write {index + 1}</h4>
                    <KeyValueDisplay
                      data={[
                        {
                          label: "leafSlot",
                          value: publicDataWrite.leafSlot,
                        },
                        {
                          label: "value",
                          value: publicDataWrite.value,
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
