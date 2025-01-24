import { Link } from "@tanstack/react-router";
import { SystemHealthStatus, useSystemHealth } from "~/hooks";
import { routes } from "~/routes/__root.tsx";
import { L2_NETWORK_ID } from "~/service/constants";
import { CustomTooltip } from "./custom-tooltip";

export const MagicDevLink = () => {
  const systemHealth = useSystemHealth();

  let healthColor = "text-red";
  switch (systemHealth.systemHealth.health) {
    case SystemHealthStatus.UP:
      healthColor = "text-green";
      break;
    case SystemHealthStatus.UNHEALTHY:
      healthColor = "text-yellow";
      break;
  }
  const tooltipContent = (
    <pre className="bg-white p-4 rounded-lg shadow-md text-black">
      {`Health: ${systemHealth.systemHealth.health}
Reason: ${systemHealth.systemHealth.reason}`}
    </pre>
  );
  return (
    <Link to={routes.dev.route} className="flex flex-row items-center">
      <span className="text-secondary transition-colors">{L2_NETWORK_ID}</span>
      <CustomTooltip content={tooltipContent}>
        <span className={`text-4xl ${healthColor} pb-4`}>•</span>
      </CustomTooltip>
    </Link>
  );
};
