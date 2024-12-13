#!/bin/sh
GIT_TAG=$(git describe --tags --abbrev=0)
GIT_COMMIT=$(git rev-parse --short HEAD)
if git diff --quiet; then
    UNCOMMITTED_CHANGES=""
else
    UNCOMMITTED_CHANGES="-DIRTY"
fi
echo "${GIT_TAG}-${GIT_COMMIT}${UNCOMMITTED_CHANGES}"
