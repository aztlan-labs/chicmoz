import { databaseService } from "./database/index.js";
import { messageBusService } from "./message-bus/index.js";
import { aztecService } from "./aztec/index.js";

export const services = [databaseService, messageBusService, aztecService];
