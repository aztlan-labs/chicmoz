import { useState, useEffect } from "react";
import { setupSandbox } from "../service/aztec";
import type { PXE } from "@aztec/aztec.js";

export const usePXEClient = () => {
  const [pxe, setPXE] = useState<PXE | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initPXE = async () => {
      try {
        const pxeClient = await setupSandbox();
        setPXE(pxeClient);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to initialize PXE client")
        );
      } finally {
        setIsLoading(false);
      }
    };

    initPXE();
  }, []);

  return { pxe, isLoading, error };
};
