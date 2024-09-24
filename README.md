# Chicmoz

## running locally

terminal 1:

```sh
minikube start --kubernetes-version=v1.25.3 --cpus max --memory max && skaffold run
```

terminal 2:

_Make sure you have .chicmoz-local.env file in the root_

```sh
# It will end with keeping the terminal open for the tunnel. (Also it will ask for your password)
./scripts/miscallaneous.sh
```

terminal 3:

```sh
cd services/explorer-ui && yarn dev
```

- UI: http://localhost:5173
- API: https://explorer-api.localhost:443
- (index of API: https://explorer-api.localhost:443/v1/d1e2083a-660c-4314-a6f2-1d42f4b944f4/l2/index)
