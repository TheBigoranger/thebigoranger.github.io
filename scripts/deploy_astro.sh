#!/bin/sh
# Run on the Pi: sudo sh deploy_astro.sh
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_USER="${SUDO_USER:-bigoranger}"
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" 2>/dev/null | cut -d: -f6)"
if [ -z "$DEPLOY_HOME" ]; then
  DEPLOY_HOME="/home/bigoranger"
fi
BUILD="${PORTFOLIO_BUILD:-$DEPLOY_HOME/Portfolio-build}"
export PORTFOLIO_GIT_OBJECTS="${PORTFOLIO_GIT_OBJECTS:-$DEPLOY_HOME/portfolio-git-objects}"
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

# Repair commits stored under $DEPLOY_HOME/portfolio-git-objects (from earlier deploys).
sh "$ROOT/scripts/merge-git-objects.sh" "$ROOT"

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

cd /var/www/CV-Yicheng-Xu
sh git_push.sh
