# Chicmoz

## running locally

Requirements:

- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [skaffold](https://skaffold.dev/docs/install/)
- [yarn](https://yarnpkg.com/getting-started/install)

terminal 1:

```sh
minikube start --kubernetes-version=v1.25.3 --cpus max --memory max && skaffold run
```

after the first time you have deployed the app you can run the following command to have faster deployments:

```sh
skaffold run -f k8s/local/skaffold.local.light.yaml
```

terminal 2:

_Make sure you have .chicmoz-local.env file in the root_

```sh
# It will end with keeping the terminal open for the tunnel. (Also it will ask for your password)
./scripts/miscallaneous.sh
```

## Pro tip

when developing locally you can command out the creation of the `explorer-ui` and run it locally

```
cd services/exporer-ui/
yarn dev
```
