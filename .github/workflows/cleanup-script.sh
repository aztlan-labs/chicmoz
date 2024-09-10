#!/bin/bash

# Function to delete old tags for a given repository
delete_old_tags() {
    local repo="$1"
    echo "Processing repository: $repo"
    
    # List tags and filter for SHA-based tags, excluding the most recent 5
    SHA_TAGS=$(doctl registry repository list-tags "$repo" --format Tag --no-header | grep -E '^sha' | sort -r | tail -n +6)
    
    # Delete each old SHA-based tag
    while IFS= read -r tag; do
        echo "Deleting tag: $tag from repository: $repo"
        doctl registry repository delete-manifest "$repo" "$tag" --force
    done <<< "$SHA_TAGS"
}

# List all repositories in the registry
REPOS=$(doctl registry repository list --format Name --no-header)

# Process each repository
while IFS= read -r repo; do
    delete_old_tags "$repo"
done <<< "$REPOS"

echo "Cleanup completed."
