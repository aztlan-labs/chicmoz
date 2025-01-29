import { useParams } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { OptionButtons } from "~/components/option-buttons";
import { useGetTxEffectByHash, useSubTitle } from "~/hooks";
import { routes } from "~/routes/__root";
import { txEffectTabs, type TabId } from "./constants";
import { getTxEffectData, mapTxEffectsData } from "./utils";

const naiveDecode = (data: string[]): string => {
  let counterZero = 0;
  let counterAbove128 = 0;
  const charCodes: number[] = data
    ?.map((hex) => parseInt(hex, 16))
    .map((charCode) => {
      if (charCode === 0) counterZero++;
      if (charCode > 128) counterAbove128++;
      return charCode;
    });
  const isNoWeirdChars = counterZero + counterAbove128 === 0;
  const isProbablyAReadableString =
    isNoWeirdChars || data.length - charCodes.indexOf(0) === counterZero;
  const res = charCodes.map((char) => String.fromCharCode(char)).join("");
  return isProbablyAReadableString ? res : data.join("\n");
};

export const TxEffectDetails: FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabId>("nullifiers");
  const { hash } = useParams({
    from: "/tx-effects/$hash",
  });
  useSubTitle(`TxEff ${hash}`);
  const { data: txEffects, isLoading, error } = useGetTxEffectByHash(hash);
  const txEffectData = mapTxEffectsData(txEffects);

  const onSelectChange = (value: string) => {
    setSelectedTab(value as TabId);
  };

  if (!hash) <div> No txEffect hash</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!txEffects || !selectedTab) return <div>No data</div>;

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
            options={txEffectTabs}
            availableOptions={txEffectData}
            onOptionSelect={onSelectChange}
            selectedItem={selectedTab}
          />
          <div className="bg-white rounded-lg shadow-md p-4">
            {selectedTab === "privateLogs" && (
              <div className="">
                {txEffects.privateLogs.map((log, index) => {
                  const entries = [
                    {
                      label: "data",
                      value: log.toString(),
                      isClickable: false,
                    },
                  ];
                  return (
                    <div key={index}>
                      <h4>Log {index + 1}</h4>
                      <KeyValueDisplay key={index} data={entries} />
                    </div>
                  );
                })}
              </div>
            )}
            {selectedTab === "publicLogs" && (
              <div className="">
                {
                  txEffects.publicLogs.map(
                    ([contractAddress, ...logData], index) => {
                      const entries = [
                        {
                          label: "data",
                          value: naiveDecode(logData),
                          isClickable: false,
                        },
                        {
                          label: "Contract Address",
                          value: contractAddress,
                          link: `${routes.contracts.route}/${routes.contracts.children.instances.route}/${contractAddress}`,
                          isClickable: true,
                        },
                      ];
                      return (
                        <div key={index}>
                          <h4>Log {index + 1}</h4>
                          <KeyValueDisplay key={index} data={entries} />
                        </div>
                      );
                    }
                  )
                  // TODO: decode logs (old decode below)
                  //  txEffects.unencryptedLogs.functionLogs.map(
                  //  (unencrypted, index) => {
                  //    const entries = unencrypted.logs.map((unEncLog) => {
                  //      return [
                  //        {
                  //          label: "data",
                  //          value: naiveDecode(unEncLog.data),
                  //          isClickable: false,
                  //        },
                  //        {
                  //          label: "Contract Address",
                  //          value: (unEncLog as { contractAddress: string })
                  //            .contractAddress,
                  //          isClickable: true,
                  //        },
                  //      ];
                  //    });
                  //    // Flatten the nested arrays
                  //    const flattenedEntries = entries.flat();
                  //    // Render KeyValueDisplay with the flattened entries
                  //    return (
                  //      <div key={index}>
                  //        <h4>Log {index + 1}</h4>
                  //        <KeyValueDisplay key={index} data={flattenedEntries} />
                  //      </div>
                  //    );
                  //  }
                }
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
