import { type ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";
import { type tabId } from "./constants";
import { formatTimeSince } from "~/lib/utils";
import { API_URL, aztecExplorer } from "~/service/constants";
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
  | Array<{ leafSlot: string; value: string }>;

export const getTxEffectData = (data: ChicmozL2TxEffectDeluxe) => [
  {
    label: "HASH",
    value: data.hash,
  },
  {
    label: "TRANSACTION HASH",
    value: data.txHash,
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
  { label: "MINED ON CHAIN", value: formatTimeSince(data.timestamp) },
  {
    label: "CREATED AS TRANSACTION",
    value: formatTimeSince(data.txBirthTimestamp),
  },
  {
    label: "RAW DATA",
    value: `/${aztecExplorer.getL2TxEffectByHash}${data.hash}`,
    extLink: `${API_URL}/${aztecExplorer.getL2TxEffectByHash}${data.hash}`,
  },
];

export const mapTxEffectsData = (
  data?: ChicmozL2TxEffectDeluxe
): Record<string, TxEffectDataType | undefined> => {
  if (!data) return {};

  const effectsMap: Record<tabId, TxEffectDataType | undefined> = {
    encryptedLogs: data.encryptedLogs?.functionLogs?.filter(
      (log) => log.logs.length > 0
    ).length
      ? data.encryptedLogs.functionLogs.filter((log) => log.logs.length > 0)
      : undefined,
    unencryptedLogs: data.unencryptedLogs?.functionLogs?.filter(
      (log) => log.logs.length > 0
    ).length
      ? data.unencryptedLogs.functionLogs
      : undefined,
    nullifiers: data.nullifiers?.length ? data.nullifiers : undefined,
    noteEncryptedLogs: data.noteEncryptedLogs?.functionLogs?.filter(
      (log) => log.logs.length > 0
    ).length
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
    Object.entries(effectsMap).filter(([_, value]) => value !== undefined)
  );
};
