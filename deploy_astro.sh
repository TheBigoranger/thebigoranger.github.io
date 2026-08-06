#!/bin/sh
# Run on the Pi: sh deploy_astro.sh  (git push may require: sudo sh deploy_astro.sh)
set -eu
ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD="${PORTFOLIO_BUILD:-$HOME/Portfolio-build}"
GIT_OBJECTS="${PORTFOLIO_GIT_OBJECTS:-$HOME/portfolio-git-objects}"
SSH_CMD='ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new'

mkdir -p "$BUILD" "$GIT_OBJECTS"
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

export GIT_OBJECT_DIRECTORY="$GIT_OBJECTS"
export GIT_ALTERNATE_OBJECT_DIRECTORIES="$ROOT/.git/objects"

GIT="git -c safe.directory=$ROOT -c user.name=TheBigoranger -c user.email=ethanxuyicheng@gmail.com"

$GIT add -A
$GIT commit -m "build: auto deploy $(date '+%Y-%m-%d %H:%M:%S')" || true

if ! $GIT push; then
  echo "Retrying git push with root SSH key (sudo)..."
  sudo env GIT_OBJECT_DIRECTORY="$GIT_OBJECTS" \
    GIT_ALTERNATE_OBJECT_DIRECTORIES="$ROOT/.git/objects" \
    GIT_SSH_COMMAND="$SSH_CMD" \
    git -c safe.directory="$ROOT" -C "$ROOT" push
fi

unset GIT_OBJECT_DIRECTORY GIT_ALTERNATE_OBJECT_DIRECTORIES

cd /var/www/CV-Yicheng-Xu
sh git_push.sh
