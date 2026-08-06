#!/bin/sh
# Wrapper — use: sudo sh deploy_astro.sh
exec sh "$(dirname "$0")/scripts/deploy_astro.sh"
