import { type ChicmozL2RpcNodeError } from "@chicmoz-pkg/types";
import { useEffect, useState } from "react";
import { formatDuration, formatTimeSince } from "~/lib/utils";
import { useChainErrors } from ".";
import { getLastError, getLastSuccessfulRequest } from "../api/client";
import { useWebSocketConnection, type WsReadyStateText } from "./websocket";

export enum SystemHealthStatus {
  DOWN = "DOWN",
  UP = "UP",
  UNHEALTHY = "UNHEALTHY",
}

export type EvaluatedHealth = {
  health: SystemHealthStatus;
  reason: string;
};

const API_POLL_INTERVAL = 1000;
const REASONABLE_API_LIVENESS_TIME = 1000 * 60 * 5;

const evaluateHealth = ({
  webSocketReadyState,
  lastSuccessfulRequest,
  lastError,
  chainErrors,
}: {
  webSocketReadyState: WsReadyStateText;
  lastSuccessfulRequest: { date: Date; path: string } | null;
  lastError: {
    date: Date;
    error: { type: "API" | "Schema"; status: number; message: string };
  } | null;
  chainErrors: ChicmozL2RpcNodeError[] | undefined;
}): EvaluatedHealth => {
  const reasonableTimeStamp = Date.now() - REASONABLE_API_LIVENESS_TIME;

  if (!lastSuccessfulRequest && lastError) {
    return {
      health: SystemHealthStatus.DOWN,
      reason: `${lastError?.error.status} - ${lastError?.error.message}`,
    };
  }

  if (!lastSuccessfulRequest) {
    return {
      health: SystemHealthStatus.DOWN,
      reason: "No successful requests have been made",
    };
  }

  const noSuccessfulRequestWithinReasonableTime =
    lastSuccessfulRequest.date.getTime() < reasonableTimeStamp;
  const errorFreeWithinReasonableTime =
    (lastError?.date?.getTime() ?? 0) < reasonableTimeStamp;

  if (
    noSuccessfulRequestWithinReasonableTime &&
    errorFreeWithinReasonableTime
  ) {
    return {
      health: SystemHealthStatus.DOWN,
      reason: `There has only been errors for the last ${formatDuration(
        REASONABLE_API_LIVENESS_TIME
      )}`,
    };
  }

  if (!errorFreeWithinReasonableTime) {
    return {
      health: SystemHealthStatus.UNHEALTHY,
      reason: `There has been an API-error recently: ${
        lastError!.error.message
      }`,
    };
  }

  if (
    chainErrors?.length &&
    chainErrors.some(
      (error) => error.lastSeenAt.getTime() > reasonableTimeStamp
    )
  ) {
    return {
      health: SystemHealthStatus.UNHEALTHY,
      reason: `API-connection is working, but the indexer has reported errors`,
    };
  }

  if (webSocketReadyState !== "OPEN") {
    return {
      health: SystemHealthStatus.UNHEALTHY,
      reason: "WebSocket connection is not open",
    };
  }

  return {
    health: SystemHealthStatus.UP,
    reason: "All systems are operational",
  };
};

export const useSystemHealth = () => {
  const wsReadyState = useWebSocketConnection();
  const [lastSuccessfulRequest, setLastSuccessfulRequest] = useState<{
    date: Date;
    path: string;
  } | null>(null);
  const [lastError, setLastError] = useState<{
    date: Date;
    error: { type: "API" | "Schema"; message: string };
  } | null>(null);
  const { data: chainErrors } = useChainErrors();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentLastSuccessfulRequest = getLastSuccessfulRequest();
      const currentLastError = getLastError();

      if (currentLastSuccessfulRequest !== lastSuccessfulRequest)
        setLastSuccessfulRequest(currentLastSuccessfulRequest);

      if (currentLastError !== lastError) setLastError(currentLastError);
    }, API_POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [lastError, lastSuccessfulRequest]);

  const systemHealth = evaluateHealth({
    webSocketReadyState: wsReadyState,
    lastSuccessfulRequest,
    lastError,
    chainErrors,
  });
  return {
    systemHealth,
    wsReadyState,
    lastSuccessfulRequest: lastSuccessfulRequest
      ? {
          lastSuccessfulRequestSeen:
            formatTimeSince(lastSuccessfulRequest.date.getTime()) + " ago",
          path: lastSuccessfulRequest.path,
        }
      : null,
    lastError: lastError
      ? {
          lastErrorSeen: formatTimeSince(lastError.date.getTime()) + " ago",
          type: lastError.error.type,
          message: lastError.error.message,
        }
      : null,
  };
};
