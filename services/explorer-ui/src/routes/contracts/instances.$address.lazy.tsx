import { createLazyFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { ContractInstanceDetails } from "~/pages/contracts-instance-details";
||||||| a40adf6
import { ContractInstanceDetails } from "~/pages/contracts/instance-details";
=======
import { ContractInstanceDetails } from "~/pages/contract-instance-details";
>>>>>>> 28e5d9d406516ca694cd4614b096ac6497671259

export const Route = createLazyFileRoute("/contracts/instances/$address")({
  component: ContractInstanceDetails,
});
