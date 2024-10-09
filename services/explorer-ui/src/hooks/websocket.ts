import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WS_URL } from "~/service/constants";
import { type ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";

export const useWebSocketConnection = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => console.log("WebSocket Connected");

    websocket.onmessage = (event) => {
      if (typeof event.data !== "string")
        console.error("WebSocket message is not a string");
      handleWebSocketMessage(event.data as string);
    };

    websocket.onclose = () => console.log("WebSocket Disconnected");

    return () => websocket.close();
  }, []);

  const handleWebSocketMessage = (data: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const d = JSON.parse(data);
    const block = chicmozL2BlockSchema.parse(d);
    queryClient.setQueryData(["latestBlock"], block);
    queryClient.setQueryData(["latestBlocks"], (oldData: ChicmozL2Block[]) => {
      if (oldData.find((b) => b.hash === block.hash)) return oldData;
      return [block, ...oldData];
    });
  };
};
