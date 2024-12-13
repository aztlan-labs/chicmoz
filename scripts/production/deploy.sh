#!/bin/bash

set -e

VERSION_STRING="$(scripts/set_version_string.sh) skaffold run --filename "k8s/production/skaffold.production.light.yaml" --default-repo=registry.digitalocean.com/aztlan-containers
