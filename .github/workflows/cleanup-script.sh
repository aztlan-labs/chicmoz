#!/bin/bash

# Enable error reporting
set -e

# Function to delete old tags for a given repository
delete_old_tags() {
    local repo="$1"
    echo "Processing repository: $repo"
    
    # List tags and filter for SHA-based tags, excluding the most recent 5
    SHA_TAGS=$(doctl registry repository list-tags "$repo"  --format "Manifest Digest" --no-header | grep -E '^sha' | sort -r | tail -n +2) || true
    
    if [ -z "$SHA_TAGS" ]; then
        echo "No old SHA tags found for repository: $repo"
        return
    fi
    
    # Delete each old SHA-based tag
    while IFS= read -r tag; do
        echo "Attempting to delete tag: $tag from repository: $repo"
        if doctl registry repository delete-manifest "$repo" "$tag" --force; then
            echo "Successfully deleted tag: $tag from repository: $repo"
        else
            echo "Failed to delete tag: $tag from repository: $repo"
        fi
    done <<< "$SHA_TAGS"
}

# Function to start garbage collection
start_garbage_collection() {
    echo "Starting garbage collection..."
    doctl registry garbage-collection start --include-untagged-manifests --force
}

# Function to check garbage collection status
check_garbage_collection_status() {
    local status
    status=$(doctl registry garbage-collection get-active --format Status --no-header)
    echo "$status"
}

# Function to wait for garbage collection to complete
wait_for_garbage_collection() {
    echo "Waiting for garbage collection to complete..."
    while true; do
        local status
        status=$(check_garbage_collection_status)
        if [ "$status" = "succeeded" ]; then
            echo "Garbage collection completed successfully."
            break
        elif [ "$status" = "failed" ]; then
            echo "Garbage collection failed."
            exit 1
        fi
        echo "Garbage collection is still in progress. Waiting..."
        sleep 60  # Wait for 60 seconds before checking again
    done
}

# List all repositories in the registry
echo "Listing repositories..."
REPOS=$(doctl registry repository list --format Name --no-header) || { echo "Failed to list repositories"; exit 1; }

if [ -z "$REPOS" ]; then
    echo "No repositories found in the registry."
    exit 0
fi

# Process each repository
while IFS= read -r repo; do
    delete_old_tags "$repo"
done <<< "$REPOS"

# Start garbage collection
start_garbage_collection

# Wait for garbage collection to complete
wait_for_garbage_collection

echo "Cleanup and garbage collection completed."
