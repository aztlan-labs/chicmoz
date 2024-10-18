import { createLazyFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { ContractClassDetails } from "~/pages/contracts-class-details";
||||||| a40adf6
import { ContractClassDetails } from "~/pages/contracts/class-details";
=======
import { ContractClassDetails } from "~/pages/contract-class-details";
>>>>>>> 28e5d9d406516ca694cd4614b096ac6497671259

export const Route = createLazyFileRoute("/contracts/classes/$id")({
  component: ContractClassDetails,
});
