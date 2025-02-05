#!/bin/bash

set -e

VERSION_STRING="$(git describe --tags)" skaffold run --filename "k8s/production/skaffold.full.yaml" --default-repo=registry.digitalocean.com/aztlan-containers
