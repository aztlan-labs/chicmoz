l2-listener

- pending txs - polling state and broadcasts
- proven blocks - only broadcasts when new values detected
  needs DB-counter with hashes
  needs to know from L1 if provenNumber hash not matching
- latest block - only broadcasts when new values detected
  needs DB-counter with hashes
  needs to know from L1 if proposedOnL1 hash not matching
- catch-up based on proven blocks

poller needs

1. cadance
2. back-off-rules (no - should only be in network-client)

- catch-up from genesis
- catch-up from missed stuff

contract instance should not require contract class in DB
DB should store timestamps for all events
