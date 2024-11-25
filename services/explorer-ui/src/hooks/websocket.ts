import {
  chicmozL2BlockSchema,
  chicmozL2PendingTxSchema,
  chicmozL2TxEffectSchema,
  type ChicmozL2Block,
  type ChicmozL2BlockLight,
  type ChicmozL2PendingTx,
  type WebsocketUpdateMessage,
} from "@chicmoz-pkg/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";
import { WS_URL } from "~/service/constants";
import { queryKeyGenerator, statsKey } from "./utils";

const updateBlock = (
  queryClient: ReturnType<typeof useQueryClient>,
  block: ChicmozL2BlockLight
) => {
  queryClient.setQueryData(queryKeyGenerator.latestBlock, block);
  queryClient.setQueryData(
    queryKeyGenerator.latestBlocks,
    (oldData: ChicmozL2BlockLight[] | undefined) => {
      if (!oldData) return [block];
      if (oldData.find((b) => b.hash === block.hash)) return oldData;
      return [...oldData, block].sort((a, b) => b.height - a.height);
    }
  );
};

const updateTxEffects = (
  queryClient: ReturnType<typeof useQueryClient>,
  block: ChicmozL2Block
) => {
  const txEffects = block.body.txEffects.map((txEffect) => {
    const effect = chicmozL2TxEffectSchema.parse(txEffect);
    queryClient.setQueryData(
      queryKeyGenerator.txEffectByHash(effect.hash),
      {
        ...effect,
        blockHeight: block.height,
        timestamp: block.header.globalVariables.timestamp,
      }

    );
  });
  queryClient.setQueryData(
    queryKeyGenerator.txEffectsByBlockHeight(block.height),
    txEffects
  );
};

const invalidateStats = async (
  queryClient: ReturnType<typeof useQueryClient>
) => queryClient.invalidateQueries({ queryKey: [statsKey], exact: false });

const invalidateContracts = async (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeyGenerator.latestContractClasses(),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeyGenerator.latestContractInstances,
    }),
  ]);
};

const handleBlock = async (
  queryClient: ReturnType<typeof useQueryClient>,
  blockData: ChicmozL2Block
) => {
  const block = chicmozL2BlockSchema.parse(blockData);
  updateBlock(queryClient, block);
  updateTxEffects(queryClient, block);
  await Promise.all([
    invalidateStats(queryClient),
    invalidateContracts(queryClient),
  ]);
};

const updatePendingTxs = (
  queryClient: ReturnType<typeof useQueryClient>,
  txs: ChicmozL2PendingTx[]
) => {
  queryClient.setQueryData(
    queryKeyGenerator.pendingTxs,
    (oldData: ChicmozL2PendingTx[] | undefined) => {
      if (!oldData) return txs;
      return [...oldData, ...txs].sort((a, b) => b.birthTimestamp - a.birthTimestamp);
    }
  );
};

const handlePendingTxs = (
  queryClient: ReturnType<typeof useQueryClient>,
  txsData: ChicmozL2PendingTx[]
) => {
  const txs = z.array(chicmozL2PendingTxSchema).parse(txsData);
  updatePendingTxs(queryClient, txs);
};

const handleWebSocketMessage = async (
  queryClient: ReturnType<typeof useQueryClient>,
  data: string
) => {
  const update: WebsocketUpdateMessage = JSON.parse(
    data
  ) as WebsocketUpdateMessage;
  if (update.block) await handleBlock(queryClient, update.block);
  if (update.txs) handlePendingTxs(queryClient, update.txs);
};

export const useWebSocketConnection = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => console.log("WebSocket Connected");

    websocket.onmessage = async (event) => {
      if (typeof event.data !== "string")
        console.error("WebSocket message is not a string");
      try {
        await handleWebSocketMessage(queryClient, event.data as string);
      } catch (error) {
        console.error("Error handling WebSocket message", error);
      }
    };

    websocket.onclose = () => console.log("WebSocket Disconnected");

    return () => websocket.close();
  }, [queryClient]);
};
