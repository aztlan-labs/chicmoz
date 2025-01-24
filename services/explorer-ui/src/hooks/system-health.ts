import { useWebSocketConnection } from ".";

export enum SystemHealthStatus {
  DOWN = "DOWN",
  UP = "UP",
  UNHEALTHY = "UNHEALTHY",
}

export const useSystemHealth = () => {
  const wsReadyState = useWebSocketConnection();
  return {
    status: SystemHealthStatus.UP,
    wsReadyState,
  };
};
