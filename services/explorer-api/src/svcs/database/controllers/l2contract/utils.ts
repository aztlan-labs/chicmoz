/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ChicmozL2ContractInstanceDeluxe, chicmozL2ContractInstanceDeluxeSchema } from "@chicmoz-pkg/types";
import { VERIFIED_CONTRACT_INSTANCES } from "../../../../environment.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseDeluxe = (contractClass: any, instance: any): ChicmozL2ContractInstanceDeluxe => {
  const verifiedInfo = VERIFIED_CONTRACT_INSTANCES.find(info => info.address === instance.address);
  return chicmozL2ContractInstanceDeluxeSchema.parse({
    ...contractClass,
    verifiedInfo,
    blockHash: instance.blockHash,
    packedBytecode: Buffer.from(contractClass.packedBytecode),
    address: instance.address,
    version: instance.version,
    salt: instance.salt,
    initializationHash: instance.initializationHash,
    deployer: instance.deployer,
    publicKeys: {
      masterNullifierPublicKey: instance.masterNullifierPublicKey,
      masterIncomingViewingPublicKey: instance.masterIncomingViewingPublicKey,
      masterOutgoingViewingPublicKey: instance.masterOutgoingViewingPublicKey,
      masterTaggingPublicKey: instance.masterTaggingPublicKey,
    }
  });
};