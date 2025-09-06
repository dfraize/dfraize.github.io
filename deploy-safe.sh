#!/usr/bin/env bash

set -euo pipefail

# Safe deploy script: clones remote repo, replaces contents with local site, commits, and pushes.
# Usage:
#   ./deploy-safe.sh <repo-url> [branch]
# Or set environment variables/optional .deploy.env file:
#   DEPLOY_REPO, DEPLOY_BRANCH (default: main), DEPLOY_MESSAGE

script_dir="$(cd "$(dirname "$0")" && pwd)"
source_dir="$script_dir"

# Load optional config from .deploy.env if present
if [[ -f "$source_dir/.deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "$source_dir/.deploy.env"
fi

REPO_URL="${1:-${DEPLOY_REPO:-}}"
BRANCH="${2:-${DEPLOY_BRANCH:-main}}"
COMMIT_MSG="${DEPLOY_MESSAGE:-Deploy: $(date '+%Y-%m-%d %H:%M')}"

if [[ -z "$REPO_URL" ]]; then
  echo "Error: Repository URL not provided."
  echo "Provide it as the first argument, set DEPLOY_REPO, or create .deploy.env."
  echo "Example: ./deploy-safe.sh https://github.com/USER/REPO.git main"
  exit 1
fi

command -v git >/dev/null 2>&1 || { echo "Error: git is required."; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "Error: rsync is required."; exit 1; }

temp_dir="$(mktemp -d -t deploy-XXXXXXXX)"
cleanup() { rm -rf "$temp_dir"; }
trap cleanup EXIT

echo "Cloning $REPO_URL (branch: $BRANCH) into $temp_dir..."
git -c advice.detachedHead=false clone --branch "$BRANCH" --single-branch "$REPO_URL" "$temp_dir/repo" >/dev/null 2>&1 || {
  echo "Branch '$BRANCH' not found. Attempting to clone default branch and create '$BRANCH'."
  git clone "$REPO_URL" "$temp_dir/repo"
  cd "$temp_dir/repo"
  git checkout -b "$BRANCH"
}

cd "$temp_dir/repo"

echo "Removing existing repo contents (except .git)..."
find . -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +

echo "Copying site files from $source_dir ..."
rsync -av --delete --exclude ".git" "$source_dir"/ ./

echo "Preparing commit..."
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy. Exiting."
  exit 0
fi

git commit -m "$COMMIT_MSG"
echo "Pushing to origin/$BRANCH ..."
git push origin "$BRANCH"

echo "Deployment complete."

