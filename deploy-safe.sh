#!/usr/bin/env bash

set -euo pipefail

# Simple deploy script: commit and push the current repository
# Usage:
#   ./deploy-safe.sh [commit-message] [branch]
# Notes:
# - If no branch is provided, the current branch is used.
# - If there are no changes to commit, the script will still push.
# - Requires a configured remote (e.g., origin).

script_dir="$(cd "$(dirname "$0")" && pwd)"
cd "$script_dir"

command -v git >/dev/null 2>&1 || { echo "Error: git is required."; exit 1; }

branch="${2:-$(git rev-parse --abbrev-ref HEAD)}"
commit_msg="${1:-Deploy: $(date '+%Y-%m-%d %H:%M')}"

echo "Deploying branch '$branch'..."

# Re-optimize portfolio thumbnails / hero background before staging changes
if [ -f "optimize-images.js" ] && command -v node >/dev/null 2>&1; then
  echo "Running image optimization..."
  node optimize-images.js
fi

# Re-bake header/footer/head partials into every page before staging changes
if [ -f "sync-partials.js" ] && command -v node >/dev/null 2>&1; then
  echo "Syncing partials..."
  node sync-partials.js
fi

# Regenerate the portfolio cards on index.html and portfolio.html from projects-data.json
if [ -f "generate-cards.js" ] && command -v node >/dev/null 2>&1; then
  echo "Generating portfolio cards..."
  node generate-cards.js
fi

# Regenerate the downloadable resume PDF from the latest resume.html
if [ -f "generate-resume-pdf.js" ] && command -v node >/dev/null 2>&1; then
  echo "Generating resume PDF..."
  node generate-resume-pdf.js
fi

# Stage all changes
git add -A

# Commit if there are staged changes
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "$commit_msg"
fi

# Push to upstream if configured; otherwise set it to origin/<branch>
if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  echo "Pushing to tracked upstream ..."
  git push
else
  echo "No upstream configured. Pushing to origin/$branch and setting upstream ..."
  git push -u origin "$branch"
fi

echo "Deployment complete."

