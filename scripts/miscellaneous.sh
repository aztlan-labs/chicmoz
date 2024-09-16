#!/bin/bash

if bash "$(dirname "$0")/create_local_secrets.sh"; then
    minikube tunnel --bind-address 127.0.0.1
else
    echo "Error: Failed to create local secrets. Minikube tunnel will not be started."
    exit 1
fi
