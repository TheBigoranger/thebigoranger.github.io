#!/bin/sh
# Deploy Portfolio to GitHub Pages, then sync CV repo.
# Usage: sudo sh deploy_astro.sh
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_USER="${SUDO_USER:-bigoranger}"
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" 2>/dev/null | cut -d: -f6)"
if [ -z "$DEPLOY_HOME" ]; then
  DEPLOY_HOME="/home/bigoranger"
fi
BUILD="${PORTFOLIO_BUILD:-$DEPLOY_HOME/Portfolio-build}"
SSH_CMD='ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new'

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

GIT="git -c safe.directory=$ROOT -c user.name=TheBigoranger -c user.email=ethanxuyicheng@gmail.com"

if [ "$(id -u)" -eq 0 ]; then
  run_git() {
    env GIT_SSH_COMMAND="$SSH_CMD" $GIT "$@"
  }
else
  run_git() {
    sudo env GIT_SSH_COMMAND="$SSH_CMD" $GIT "$@"
  }
fi

run_git fetch origin main
run_git add -A
run_git commit -m "build: auto deploy $(date '+%Y-%m-%d %H:%M:%S')" || true
run_git push origin main

# Drop writable build tree; use sudo if a prior root-owned build remains.
rm -rf "$BUILD" 2>/dev/null || sudo rm -rf "$BUILD" || true

cd /var/www/CV-Yicheng-Xu
sh git_push.sh
