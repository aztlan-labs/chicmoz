# tests rate limiting by triggering requests to the dummy node
# TODO: delete once we have integration tests
for i in $(seq 1 51); do
    curl node.localhost/v1/a8c9e08c-0f74-49d4-a96d-249b563f3f7a/coso
done
