//  NOTE: Catching up should publish on different topic

//  async catchUpOnBlocks(onBlockCB: (block: L2Block) => Promise<void>, startingHeight: number, endingHeight: number) {
//    try {
//      for (let i = startingHeight; i <= endingHeight; i += 1) {
//        const blockRes = await this.networkClient.getBlock(i);
//        if (blockRes instanceof Error) throw new Error(`🦆 error fetching block ${i}`);
//        if (!blockRes)
//          throw new Error("🐯 We didn't receive any block. - Is the node running?");
//        this.logger.info(`🦆 found 1 old block: ${i}`);
//        await onBlockCB(blockRes);
//        const height = Number(blockRes.header.globalVariables.blockNumber);
//        await this.setlatestHeightPublished(height);
//      }
//      this.logger.info("🦆 all blocks processed, completing...");
//    } catch (err) {
//      this.logger.error(`🦆 error catching up blocks: ${(err as Error).stack}`);
//      throw err;
//    }
//  }
//
//  async fetchBlockRange(start: number, end: number) {
//    const blocks = [];
//    for (let i = start; i <= end; i++) {
//      try {
//        const blockRes = await backOff(async () => {
//          return await this.networkClient.getBlock(i);
//        }, this.backOffOptions);
//        if (blockRes instanceof Error) throw blockRes;
//        blocks.push(blockRes);
//      } catch (e) {
//        this.logger.error(`[fetchBlockRange(${start},${end})] Error fetching block range:`, e);
//      }
//    }
//
//    return blocks;
//  }
 // async start(latestProcessedHeight = -1) {
 //   const latestHeight = await this.aztecEvents.getLatestHeight();

 //   if (CATCHUP_ENABLED && latestHeight - latestProcessedHeight >= 1) {
 //     // NOTE: the first catchup is done before starting to listen for new blocks
 //     let startFrom = latestProcessedHeight + 1;
 //     if (CATCHUP_START !== undefined) {
 //       if (CATCHUP_START < 0) {
 //         throw new Error("CATCHUP_START is negative, this is not allowed");
 //       } else if (CATCHUP_START > latestHeight) {
 //         throw new Error("CATCHUP_START is larger than latestHeight, this is not allowed");
 //       } else {
 //         this.logger.info("Using CATCHUP_START");
 //         startFrom = CATCHUP_START;
 //       }
 //     }

 //     let endAt = latestHeight + 1;
 //     if (CATCHUP_END !== undefined) {
 //       if (CATCHUP_END < 0) {
 //         throw new Error("CATCHUP_END is negative, this is not allowed");
 //       } else if (CATCHUP_END > latestHeight) {
 //         throw new Error("CATCHUP_END is larger than latestHeight, this is not allowed");
 //       } else {
 //         this.logger.info("Using CATCHUP_END");
 //         endAt = CATCHUP_END;
 //       }
 //     }

 //     this.logger.info(`Starting catchup from height: ${startFrom} to ${endAt}`);
 //     await this.aztecEvents.catchUpOnBlocks(this.eventHandler.onBlock, startFrom, endAt);
 //   }
 //   if (CATCHUP_ENABLED && CATCHUP_END === undefined) {
 //     // NOTE: the second catchup is done after starting to listen for new blocks (in case new blocks were produced while the first catchup was running)
 //     const newLatestHeight = await this.aztecEvents.getLatestHeight();
 //     if (Math.abs(newLatestHeight - latestHeight) >= 1) {
 //       this.logger.info("Starting (mini) catchup from height: ", latestHeight + 1);
 //       await this.aztecEvents.catchUpOnBlocks(this.eventHandler.onBlock, latestHeight + 1, newLatestHeight + 1);
 //     }
 //   }
 // }
