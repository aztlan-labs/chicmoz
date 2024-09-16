#!/bin/bash

# Enable error reporting
set -e

# Function to delete old tags for a given repository
delete_old_tags() {
    local repo="$1"
    echo "Processing repository: $repo"
    
    # List tags and filter for SHA-based tags, excluding the most recent 5
    SHA_TAGS=$(doctl registry repository list-tags "$repo"  --format "Manifest Digest" --no-header | grep -E '^sha' | sort -r | tail -n +3) || true
    
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

echo "Cleanup completed."
