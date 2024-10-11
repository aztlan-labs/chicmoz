#!/bin/bash

set -e

skaffold run --filename "k8s/production/skaffold.production.light.yaml" --default-repo=registry.digitalocean.com/aztlan-containers
