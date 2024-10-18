<<<<<<< HEAD
import { createLazyFileRoute } from "@tanstack/react-router";
import { Contracts } from "~/pages/contracts";
||||||| a40adf6
import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { ContractClassesAndInstancesTable } from "~/components/contracts/class-and-instance-tables";
import { InfoBadge } from "~/components/info-badge";
import { useLatestContractClasses, useLatestContractInstances } from "~/hooks";
import { useTotalContracts, useTotalContractsLast24h } from "~/hooks/stats";
=======
import { createLazyFileRoute } from "@tanstack/react-router";
import { Contracts } from "~/pages/contract";
>>>>>>> 28e5d9d406516ca694cd4614b096ac6497671259

export const Route = createLazyFileRoute("/contracts/")({
  component: Contracts,
});
