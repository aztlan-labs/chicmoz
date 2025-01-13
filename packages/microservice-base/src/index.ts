// Here is what an inialization of a microservice should include:
// -1. register a graceful shutdown using only console.log
// 0. Initialize the logger (and have it exposed)
// 1. Log the service name together with all the configs
// 2. initialize the microservices services like...
//      - DB
//      - Message Bus
//      - Cache
//      - http server
//      - websocket server
//      - other... (init aztec connection here)
// 3. start whatever is needed like...
//     - polling aztec
//     - subscribe to message bus-events

// after init and start the microservice-base should expose services healths
import { Logger } from "@chicmoz-pkg/logger-server";

export const logger: Logger = new Logger("microservice-base");

export const doIt = () => {
  logger.info("Microservice Base hello world");
}


