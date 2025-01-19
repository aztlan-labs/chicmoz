#!/bin/bash

# TODO: can this be removed?

kubectl apply -f ./explorer-ui/ingress.yaml
kubectl apply -f ./explorer-api/ingress.yaml
