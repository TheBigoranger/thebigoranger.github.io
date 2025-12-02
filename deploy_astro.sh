#!/bin/bash
npx astro build
git add .
git commit -m "build: auto deploy $(date '+%Y-%m-%d %H:%M:%S')" || true
git remote set-url origin git@github.com:thebigoranger/Portfolio.git
git push
