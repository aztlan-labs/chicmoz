# aztec-listener

## emitted events

# explorer-api

## API

- [ ] `/validators`
      NOTE: if we allow `/validators` that means we're going to have an endpoint which publicly exposes all the validators' ENRs (which is just the RPC URL but encoded in a specific format). This can be a problem. At least add a TODO in the request-handler.
- [ ] `/validators/:enr`
- [ ] `/validators/:enr/errors`
      NOTE: the two above can be bruteforced. At least add a TODO in the request-handler to rate-limit this endpoint.
- [ ] `/l2/chain/info`
- [ ] `/l2/chain/errors` (this EP should be used if latest block is not seen within a reasonable time from frontend)

## DB

### validator

#### RPC-url

- [ ] id (primary key)
- [ ] rpcUrl
- [ ] createdAt

#### validator

- [ ] enr (primary key)
- [ ] rpcId (foreign key)
- [ ] protocolVersion
- [ ] lastSeenAt
- [ ] createdAt
- [ ] l1ChainId
- [ ] L2NetworkId

#### errors

- [ ] error string (primary key)
- [ ] rpcUrl (foreign key)
- [ ] error count
- [ ] lastSeenAt
- [ ] firstSeenAt

### l2-chain-info

#### l2-chain-info

- [ ] L2NetworkId (primary key)
- [ ] l1ChainId
- [ ] l1ContractAddresses
- [ ] protocolVersion
