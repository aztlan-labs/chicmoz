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
