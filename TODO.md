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
   - [x] update handlers with new DB-controllers store
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

- L1L2Validator is the _concept of_ someone holding stake. They have their state in the staking-contract on L1. They are also the recipient of fees (`L2Block.globalVariables.coinbase`). Validator is identified by `attesterAddress`.

- L2RpcNode is an endpoint that provides access to the L2 network. It is identified by `rpcUrl`.

- L2Sequencer is an L2RpcNode that is also participating in the network as a sequencer. It is identified by its' `enr`.

## aztec-listener

### emitted events

- [ ] emitSequencerAlive (on successful poll-response)
- [ ] emitNodeError (on failed poll-response or timeout)
- [ ] emitL2ChainInfo (re-occuring every X minutes)
- [ ] emitSequencer (re-occuring every Y minutes)

## explorer-api

### API

- [ ] `/sequencer`
      NOTE: if we allow `/sequencer` that means we're going to have an endpoint which publicly exposes all the sequencer' ENRs (which is just the RPC URL but encoded). This can be a problem. At least add a TODO in the request-handler.
- [ ] `/sequencer/:enr` (agregated value: `hasError` = `sequencer.lastSeenAt < sequencerError.lastSeenAt`)
- [ ] `/sequencer/:enr/errors`
      NOTE: the two above can be bruteforced on testing with multiple `:enr`. At least add a TODO in the request-handler to rate-limit this endpoint.
- [ ] `/l2/info`
- [ ] `/l2/errors` (this EP should be used if latest block is not seen within a reasonable time from frontend, and should check rpcNodeErrors)

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
