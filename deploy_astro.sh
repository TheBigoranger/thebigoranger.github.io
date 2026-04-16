#!/bin/sh
# Portable under `sh`/`dash` (e.g. `sudo sh deploy_astro.sh`). For bash-only features, use: bash deploy_astro.sh
set -eu
cd "$(dirname "$0")"

# Ensure node_modules matches package.json (fixes missing @tailwindcss/vite, etc.)
npm install

npm run export:cv
npx astro build
git add .
git commit -m "build: auto deploy $(date '+%Y-%m-%d %H:%M:%S')" || true
#git remote set-url origin git@github.com:thebigoranger/Portfolio.git
git push
# compile the CV pdf again
cd /var/www/CV-Yicheng-Xu
sh git_push.sh
