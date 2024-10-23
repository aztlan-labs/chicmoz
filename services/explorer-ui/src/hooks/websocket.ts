import {
  chicmozL2BlockLightSchema,
  chicmozL2TxEffectSchema,
  type ChicmozL2BlockLight,
} from "@chicmoz-pkg/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
      return [block, ...oldData];
    }
  );
};

const updateTxEffects = (
  queryClient: ReturnType<typeof useQueryClient>,
  block: ChicmozL2BlockLight
) => {
  const txEffects = block.body.txEffects.map((txEffect) => {
    const effects = chicmozL2TxEffectSchema.parse({
      ...txEffect,
      blockHeight: block.height,
      timestamp: block.header.globalVariables.timestamp,
    });
    queryClient.setQueryData(
      queryKeyGenerator.txEffectByHash(effects.hash),
      effects
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

const handleWebSocketMessage = async (
  queryClient: ReturnType<typeof useQueryClient>,
  data: string
) => {
  const block = chicmozL2BlockLightSchema.parse(JSON.parse(data));
  updateBlock(queryClient, block);
  updateTxEffects(queryClient, block);
  await invalidateStats(queryClient);
};

export const useWebSocketConnection = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => console.log("WebSocket Connected");

    websocket.onmessage = async (event) => {
      if (typeof event.data !== "string")
        console.error("WebSocket message is not a string");
      await handleWebSocketMessage(queryClient, event.data as string);
    };

    websocket.onclose = () => console.log("WebSocket Disconnected");

    return () => websocket.close();
  }, []);
};
