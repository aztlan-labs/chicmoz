# TODO

1. update types `./packages/types`
   - [x] change NodeInfo to ChicmozSequencerInfo and ChicmozNodeInfo
   - [x] add ChicmozChainInfo
1. update `./packages/message-registry`
   - [x] add new messages
1. update `./services/aztec-listener`
   - [x] update the poller to emit events in current poll-structure
1. update `./services/explorer-api`
   - [x] add event-listeners for new events
   - [ ] restructure DB schemas/controllers accordingly
   - [ ] create API endpoints
1. make UI at least build with new types
1. update `./services/ethereum-listener`
1. update poll structure in `./services/aztec-listener`
   - [ ] separate the network-client from the pollers
   - [ ] create separate pollers (`MicroserviceBaseSvc`) for each poll-structure
   - [ ] add new poll-structure
1. remove old NodeInfo type from `./packages/types`

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
- [ ] emitSequencerInfo (re-occuring every Y minutes)

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

##### node

- [ ] id (primary key)
- [ ] rpcUrl
- [ ] createdAt

##### sequencer

- [ ] enr (primary key)
- [ ] nodeId (foreign key) 1:1
- [ ] L2NetworkId
- [ ] protocolVersion (separate timestamped table)
- [ ] nodeVersion (separate timestamped table)
- [ ] l1ChainId (separate timestamped table)
- [ ] lastSeenAt
- [ ] createdAt

##### nodeError

- [ ] message (primary key)
- [ ] nodeId (foreign key)
- [ ] stack
- [ ] data
- [ ] error count
- [ ] lastSeenAt
- [ ] firstSeenAt

#### l2-chain-info

##### l2-chain-info

- [ ] L2NetworkId (primary key)
- [ ] l1ChainId
- [ ] l1ContractAddresses
- [ ] protocolContractAddresses
- [ ] protocolVersion
