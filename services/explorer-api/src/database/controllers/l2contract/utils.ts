/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ChicmozL2ContractInstanceDeluxe, chicmozL2ContractInstanceDeluxeSchema } from "@chicmoz-pkg/types";
import { VERIFIED_CONTRACT_INSTANCES } from "../../../environment.js";

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
      masterNullifierPublicKey: {
        x: instance.publicKeys_masterNullifierPublicKey_x,
        y: instance.publicKeys_masterNullifierPublicKey_y,
        isInfinite: instance.publicKeys_masterNullifierPublicKey_isInfinite,
        kind: instance.publicKeys_masterNullifierPublicKey_kind,
      },
      masterIncomingViewingPublicKey: {
        x: instance.publicKeys_masterIncomingViewingPublicKey_x,
        y: instance.publicKeys_masterIncomingViewingPublicKey_y,
        isInfinite:
          instance.publicKeys_masterIncomingViewingPublicKey_isInfinite,
        kind: instance.publicKeys_masterIncomingViewingPublicKey_kind,
      },
      masterOutgoingViewingPublicKey: {
        x: instance.publicKeys_masterOutgoingViewingPublicKey_x,
        y: instance.publicKeys_masterOutgoingViewingPublicKey_y,
        isInfinite:
          instance.publicKeys_masterOutgoingViewingPublicKey_isInfinite,
        kind: instance.publicKeys_masterOutgoingViewingPublicKey_kind,
      },
      masterTaggingPublicKey: {
        x: instance.publicKeys_masterTaggingPublicKey_x,
        y: instance.publicKeys_masterTaggingPublicKey_y,
        isInfinite: instance.publicKeys_masterTaggingPublicKey_isInfinite,
        kind: instance.publicKeys_masterTaggingPublicKey_kind,
      },
    },
  });
};
