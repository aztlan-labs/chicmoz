#!/bin/bash

# NOTE: all this hassle just to *only* use 5 images on the registry...

set -e

# List of images to push
IMAGES_TO_PUSH=(
  "explorer-ui"
  "auth"
  "aztec-listener"
  "explorer-api"
  "websocket-event-publisher"
)

# Build images and get the build output
BUILD_OUTPUT=$(skaffold build --filename "k8s/production/skaffold.production.light.yaml" --quiet)

# Function to extract tag for a specific image
get_tag() {
  local image=$1
  echo "$BUILD_OUTPUT" | grep "$image" | sed -E 's/.*:([^}]+)\}.*/\1/' | tr -d '"'
}

# Function to find the latest image
find_latest_image() {
  local image=$1
  docker images --format "{{.Repository}}:{{.Tag}}" | grep "^$image:" | head -n 1
}

# Tag and push each image
for image in "${IMAGES_TO_PUSH[@]}"
do
  TAG=$(get_tag "$image")
  if [ -n "$TAG" ]; then
    LATEST_IMAGE=$(find_latest_image "$image")
    if [ -n "$LATEST_IMAGE" ]; then
      echo "Tagging and pushing $LATEST_IMAGE as registry.digitalocean.com/aztlan-containers/$image:$TAG"
      docker tag "$LATEST_IMAGE" "registry.digitalocean.com/aztlan-containers/$image:$TAG"
      docker push "registry.digitalocean.com/aztlan-containers/$image:$TAG"
    else
      echo "Failed to find latest image for $image"
      exit 1
    fi
  else
    echo "Failed to get tag for $image"
    exit 1
  fi
done

# Get the tag for chicmoz-base
CHICMOZ_BASE_TAG=$(get_tag "chicmoz-base")

# Prepare the --images argument for skaffold deploy
DEPLOY_IMAGES_ARG="chicmoz-base=chicmoz-base:$CHICMOZ_BASE_TAG,"
for image in "${IMAGES_TO_PUSH[@]}"
do
  TAG=$(get_tag "$image")
  if [ -n "$TAG" ]; then
    DEPLOY_IMAGES_ARG+="$image=registry.digitalocean.com/aztlan-containers/$image:$TAG,"
  else
    echo "Failed to get tag for $image"
    exit 1
  fi
done
DEPLOY_IMAGES_ARG=${DEPLOY_IMAGES_ARG%,}  # Remove trailing comma

# Deploy using Skaffold
echo "Deploying with images: $DEPLOY_IMAGES_ARG"
skaffold deploy --filename "k8s/production/skaffold.production.light.yaml" --images "$DEPLOY_IMAGES_ARG"
