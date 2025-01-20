#!/bin/bash

set -e

bash "$(dirname "$0")/../create_local_secrets.sh"

VERSION_STRING="$(git describe --tags)" skaffold run --filename "k8s/production/skaffold.production.light.yaml" --default-repo=registry.digitalocean.com/aztlan-containers
