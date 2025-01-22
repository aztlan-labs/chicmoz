# TODO

1. update types `./packages/types`
   - [x] change Node to ChicmozSequencer and ChicmozNode
   - [x] add ChicmozChainInfo
1. update `./packages/message-registry`
   - [x] add new messages
1. update `./services/aztec-listener`
   - [x] update the poller to emit events in current poll-structure
1. update `./services/explorer-api`
   - [x] add event-listeners for new events
   - [x] create new DB schemas
   - [x] create new DB-controllers with store functions
   - [ ] update handlers with new DB-controllers store
   - [ ] create API endpoints
   - [ ] update DB-controllers with appropriate fetch functions
1. make UI at least build with new types
1. update `./services/ethereum-listener`
1. update poll structure in `./services/aztec-listener`
   - [ ] separate the network-client from the pollers
   - [ ] create separate pollers (`MicroserviceBaseSvc`) for each poll-structure
   - [ ] add new poll-structure
1. remove old Node type from `./packages/types`

# Plan

## concepts

- Validator is the _concept of_ someone holding stake. They have their state in the staking-contract on L1. They are also the recipient of fees (`L2Block.globalVariables.coinbase`). Validator is identified by `attesterAddress`.

- Node is a server that receives txns to add to txnPool, gossips and listen to the P2P network and runs sequencer software. Node is identified by RPC-URL, generally, and ENR more specifically.\*

- Sequencer is the software that runs all of this stuff: https://docs.aztec.network/aztec/network/sequencer . Sequencer has a 1:1 with Node.

* Up until the moment a node has replied with their ENR the RPC-URL is the only thing that identifies it.

## aztec-listener

### emitted events

- [ ] emitSequencerAlive (on successful poll-response)
- [ ] emitNodeError (on failed poll-response or timeout)
- [ ] emitL2ChainInfo (re-occuring every X minutes)
- [ ] emitSequencer (re-occuring every Y minutes)

## explorer-api

### API

- [ ] `/sequencer`
      NOTE: if we allow `/sequencer` that means we're going to have an endpoint which publicly exposes all the sequencer' ENRs (which is just the RPC URL but encoded in a specific format). This can be a problem. At least add a TODO in the request-handler.
- [ ] `/sequencer/:enr` (agregated value `hasError` = `sequencer.lastSeenAt < sequencerError.lastSeenAt`)
- [ ] `/sequencer/:enr/errors`
      NOTE: the two above can be bruteforced. At least add a TODO in the request-handler to rate-limit this endpoint.
- [ ] `/l2/info`
- [ ] `/l2/errors` (this EP should be used if latest block is not seen within a reasonable time from frontend)

### DB

#### node (sequencer)

##### node (l2RpcNodeTable)

- [x] rpcUrl (primary key)
- [x] id
- [x] createdAt

##### sequencer (l2SequencerTable)

- [x] enr (primary key)
- [x] rpcUrl (foreign key to l2RpcNodeTable)
- [x] L2NetworkId
- [x] protocolVersion
- [x] nodeVersion
- [x] l1ChainId
- [x] lastSeenAt
- [x] createdAt

##### nodeError (l2RpcNodeErrorTable)

- [x] name (primary key)
- [x] rpcUrl (foreign key to l2RpcNodeTable)
- [x] cause
- [x] message
- [x] stack
- [x] data
- [x] count
- [x] createdAt

#### l2-chain-info (l2ChainInfoTable)

- [x] L2NetworkId (primary key)
- [x] l1ChainId
- [x] l1ContractAddresses
- [x] protocolContractAddresses
- [x] protocolVersion
- [x] createdAt
- [x] updatedAt
