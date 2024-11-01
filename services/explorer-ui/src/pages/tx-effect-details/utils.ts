import { type ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";
import { Tab, tabId } from "./constants";
export type TxEffectDataType =
  | string[]
  | Array<{ logs: Array<{ data: string; contractAddress: string }> }>
  | Array<{
      logs: Array<{
        data: string;
        maskedContractAddress: string;
      }>;
    }>
  | Array<{ logs: Array<{ data: string }> }>
  | Array<{ leafIndex: string; newValue: string }>;

export const getTxEffectData = (data: ChicmozL2TxEffectDeluxe) => [
  {
    label: "HASH",
    value: data.hash,
  },
  {
    label: "TRANSACTION FEE (FPA)",
    value: data.transactionFee.toString(),
  },
  {
    label: "BLOCK NUMBER",
    value: data.blockHeight.toString(),
    link: `/blocks/${data.blockHeight}`,
  },
  { label: "TIMESTAMP", value: data.timestamp.toString() },
];

export const mapTxEffectsData = (
  data?: ChicmozL2TxEffectDeluxe,
): Record<string, TxEffectDataType | undefined> => {
  if (!data) return {};

  console.log(
    data.encryptedLogs?.functionLogs?.filter((log) => log.logs.length > 0),
  );
  const effectsMap: Record<tabId, TxEffectDataType | undefined> = {
    encryptedLogs: !data.encryptedLogs?.functionLogs?.filter(
      (log) => log.logs.length > 0,
    )
      ? data.encryptedLogs.functionLogs.filter((log) => log.logs.length > 0)
      : undefined,
    unencryptedLogs: !data.unencryptedLogs?.functionLogs?.filter(
      (log) => log.logs.length > 0,
    )
      ? data.unencryptedLogs.functionLogs
      : undefined,
    nullifiers: data.nullifiers?.length ? data.nullifiers : undefined,
    noteEncryptedLogs: !data.noteEncryptedLogs?.functionLogs?.filter(
      (log) => log.logs.length > 0,
    )
      ? data.noteEncryptedLogs.functionLogs
      : undefined,
    noteHashes: data.noteHashes?.length ? data.noteHashes : undefined,
    l2ToL1Msgs: data.l2ToL1Msgs?.length ? data.l2ToL1Msgs : undefined,
    publicDataWrites: data.publicDataWrites?.length
      ? data.publicDataWrites
      : undefined,
  };

  // Filter out undefined values
  return Object.fromEntries(
    Object.entries(effectsMap).filter(([_, value]) => value !== undefined),
  );
};
export function areAllOptionsAvailable<
  T extends Record<string, TxEffectDataType>,
>(record: T, options: string[]): boolean {
  return options.every(
    (option) =>
      option in record &&
      record[option] !== undefined &&
      record[option] !== null,
  );
}
