#!/bin/sh
# Portable under `sh`/`dash` (e.g. `sudo sh deploy_astro.sh`).
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD="${PORTFOLIO_BUILD:-$HOME/Portfolio-build}"

# Build in a user-writable copy (server node_modules is often root-owned).
mkdir -p "$BUILD"
rsync -a --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude dist \
  "$ROOT/" "$BUILD/"

cd "$BUILD"
npm install
npm run export:cv
npm run build
cd "$ROOT"

GIT_PORTFOLIO="git -c safe.directory=$ROOT"
run_git_portfolio() {
  $GIT_PORTFOLIO "$@"
}

if ! run_git_portfolio add -A 2>/dev/null; then
  echo "Git index requires elevated permissions on this host..."
  sudo env GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
    git -c safe.directory="$ROOT" add -A
  sudo env GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
    git -c safe.directory="$ROOT" commit -m "build: auto deploy $(date '+%Y-%m-%d %H:%M:%S')" || true
  sudo env GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
    git -c safe.directory="$ROOT" push
else
  run_git_portfolio commit -m "build: auto deploy $(date '+%Y-%m-%d %H:%M:%S')" || true
  run_git_portfolio push
fi

# Push CV sources; background job refreshes PDF on Portfolio after CI.
cd /var/www/CV-Yicheng-Xu
sh git_push.sh
