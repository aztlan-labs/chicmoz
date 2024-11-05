# Chicmoz

## running locally

Requirements:

- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [skaffold](https://skaffold.dev/docs/install/)
- [yarn](https://yarnpkg.com/getting-started/install)

**terminal 1:**

```sh
minikube start --kubernetes-version=v1.25.3 --cpus max --memory max && skaffold run -f k8s/local/skaffold.default.yaml
```

**terminal 2:**

⚠️ _will ask for your password in order to port forward_

⚠️ _Make sure you have .chicmoz-local.env file in the root_

```sh
# It will end with keeping the terminal open for the tunnel.
./scripts/miscallaneous.sh
```

Now you can access the explorer at http://explorer-ui.localhost and also...

- API: http://explorer-api.localhost
- index of API: http://explorer-api.localhost/v1/d1e2083a-660c-4314-a6f2-1d42f4b944f4/l2/index

### Different Aztec-setups

#### Option 1 - default

Default settings is to set up a sandbox in the local cluster.

#### Option 0 - connect to your already running sandbox or to public devnet

Update the `CHICMOZ_AZTEC_RPC` in the `.chicmoz-local.env` to desired endpoint and then run

```sh
skaffold run -f k8s/local/skaffold.remote_aztec.yaml
```

## Pro tip

### 1

after the first time you have deployed the app you can run the following command to have faster deployments:

```sh
skaffold run -f k8s/local/skaffold.default_dev.yaml
```

### 2

if you run the explorer with `skaffold run -f k8s/local/skaffold.no_ui.yaml` you can run the explorer-ui locally for even faster development:

```
cd services/exporer-ui/
yarn dev
```
