# Chicmoz

## running locally

Requirements:

- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [skaffold](https://skaffold.dev/docs/install/)
- [yarn](https://yarnpkg.com/getting-started/install)

**terminal 1:**

```sh
minikube start --kubernetes-version=v1.25.3 --cpus max --memory max && skaffold run
```

**terminal 2:**

⚠️ _will ask for your password in order to port forward_

⚠️ _Make sure you have .chicmoz-local.env file in the root_

```sh
# It will end with keeping the terminal open for the tunnel.
./scripts/miscallaneous.sh
```

### with Sandbox

Default settings is to run against the Devnet, if you want to run against the Sandbox you need to do one of the following:

#### Option 1 - your own existing sandbox running on your machine

Update the `CHICMOZ_AZTEC_RPC` in the `.chicmoz-local.env` to your sandbox rpc url.

#### Option 2 - run the sandbox in the local cluster

Update to the commented out config in both...

- `k8s/local/skaffold.local.yaml`
- `k8s/local/aztec-listener/deployment.yaml`

## Pro tip

after the first time you have deployed the app you can run the following command to have faster deployments:

```sh
skaffold run -f k8s/local/skaffold.local.light.yaml
```

when developing locally you can command out the creation of the `explorer-ui` and run it locally

```
cd services/exporer-ui/
yarn dev
```

- API: http://explorer-api.localhost
- index of API: http://explorer-api.localhost/v1/d1e2083a-660c-4314-a6f2-1d42f4b944f4/l2/index
