#!/bin/bash

# TODO: can this be done through skaffold?

kubectl apply -f ./explorer-ui/ingress.yaml
kubectl apply -f ./explorer-api/ingress.yaml
