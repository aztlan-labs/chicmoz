import { PXE, createPXEClient } from "@aztec/aztec.js";

export class AztecNetworkClient {
  pxe: PXE;

  constructor(aztecNodeUrl: string) {
    this.pxe = createPXEClient(aztecNodeUrl);
  }

  getBlock(height: number) {
    return this.pxe.getBlock(height);
  }

  getLatestHeight() {
    return this.pxe.getBlockNumber();
  }
}
