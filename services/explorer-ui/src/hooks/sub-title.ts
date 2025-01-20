import { useEffect } from "react";
import { APP_NAME, L2_NETWORK_ID } from "~/service/constants";

const baseTitle =
  process.env.NODE_ENV === "production" ? APP_NAME : L2_NETWORK_ID;

export const useSubTitle = (title: string) =>
  useEffect(() => {
    document.title = `${title} | ${baseTitle}`;
  });
