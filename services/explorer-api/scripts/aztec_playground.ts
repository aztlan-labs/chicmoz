//// import { createPXEClient } from "@aztec/aztec.js";
//import { logger } from "../src/logger.js";
//import { Block, partialBlockSchema } from "../src/block-types.js";
//
//// const AZTEC_NODE_URL = "http://localhost:8080";
//
//const partialBlockMock = {
//  hash: "0x00eb5ff749db596bc32ea4e7d79dfbbc7757e1d4bbd02a072a6e7ee1d05fd53c",
//  number: 6,
//  timestamp: 1725438712,
//  archive: {
//    id: "ade4b3ce-60ba-4f72-9888-f0022686ac1c",
//    root: "0x17d4e666b52e86e1ecebe27e84a95420da9b377f83afedfd9a56206f9aed3ad0",
//    nextAvailableLeafIndex: 6,
//  },
//  header: {
//    id: "08049b88-abb8-4bfa-9327-87cbd17169c5",
//    lastArchive: {
//      root: {
//        type: "Fr",
//        value:
//          "0x0ce917aaf5c5e509794cc3ea8d49c08a539f10d4d57a53c4d221015ea2a4c4e7",
//      },
//      nextAvailableLeafIndex: 6,
//    },
//    contentCommitmentId: "9d272bd1-e3a7-40e8-b1a0-17aa2f041ce2",
//    stateId: "3c905635-483b-4986-a9a5-43d342da516b",
//    globalVariablesId: "1d989360-2bef-4fa3-84fe-349fbab4a04f",
//    totalFees:
//      "0x000000000000000000000000000000000000000000000000000000000bfda4fc",
//  },
//  body: { id: "3a10596c-6a5c-40ab-9562-5215d04ab7f4" },
//};
//
//const main = () => {
//  const parsed: Partial<Block> = partialBlockSchema.parse(partialBlockMock);
//  logger.info(`Parsed block: ${JSON.stringify(parsed, null, 2)}`);
//};
//
//// const testType = async (dbBlock: unknown) => {
////   const b: Partial<Block> = blockSchema.partial().parse(dbBlock);
////   // const l2Block = L2Block.fromFields({
////   //   archive: b.archive,
////   //   header: b.header,
////   //   body: b.body,
////   // });
////   // logger.info(`Block number: ${l2Block.number}`);
//// };
//// 
//// const main = async () => {
////   const pxe = createPXEClient(AZTEC_NODE_URL);
////   const latestHeight = await pxe.getBlockNumber();
////   const block = await pxe.getBlock(latestHeight);
//// 
////   if (!block) {
////     logger.error(`Failed to get block ${latestHeight}`);
////     return;
////   }
//// 
////   const hash = block?.hash()?.toString() as string;
////   const sentToDb = {
////     number: block.number,
////     hash,
////     timestamp: block.getStats().blockTimestamp,
////     archive: block.archive,
////     header: block.header,
////     body: block.body,
////   };
////   const retrievedFromDb = JSON.parse(JSON.stringify(sentToDb));
////   testType(retrievedFromDb);
////   // logger.info(JSON.stringify(dbBlock, null, 2));
//// };
//
//main().catch((e) => {
//  logger.error(`Failed to investigate block: ${e}`);
//});
