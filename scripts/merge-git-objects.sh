#!/bin/sh
# Merge commits created with GIT_OBJECT_DIRECTORY back into .git/objects (run once if HEAD is broken).
set -eu
ROOT="${1:-/var/www/Portfolio}"
DEPLOY_USER="${SUDO_USER:-bigoranger}"
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" 2>/dev/null | cut -d: -f6)"
if [ -z "$DEPLOY_HOME" ]; then
  DEPLOY_HOME="/home/bigoranger"
fi
ALT="${PORTFOLIO_GIT_OBJECTS:-$DEPLOY_HOME/portfolio-git-objects}"

if [ ! -d "$ALT" ] || [ -z "$(ls -A "$ALT" 2>/dev/null)" ]; then
  echo "No alternate object directory at $ALT — nothing to merge."
  exit 0
fi

echo "Merging git objects from $ALT into $ROOT/.git/objects ..."

merge_objects() {
  src="$1"
  dest="$2"
  [ -d "$src" ] || return 0
  for dir in "$src"/*; do
    [ -d "$dir" ] || continue
    base="$(basename "$dir")"
    mkdir -p "$dest/$base"
    for obj in "$dir"/*; do
      [ -f "$obj" ] || continue
      name="$(basename "$obj")"
      if [ ! -f "$dest/$base/$name" ]; then
        cp "$obj" "$dest/$base/$name"
      fi
    done
  done
}

if [ "$(id -u)" -eq 0 ]; then
  merge_objects "$ALT" "$ROOT/.git/objects"
else
  sudo sh -c "
    merge_objects() {
      src=\"\$1\"; dest=\"\$2\"
      for dir in \"\$src\"/*; do
        [ -d \"\$dir\" ] || continue
        base=\$(basename \"\$dir\")
        mkdir -p \"\$dest/\$base\"
        for obj in \"\$dir\"/*; do
          [ -f \"\$obj\" ] || continue
          name=\$(basename \"\$obj\")
          [ -f \"\$dest/\$base/\$name\" ] || cp \"\$obj\" \"\$dest/\$base/\$name\"
        done
      done
    }
    merge_objects '$ALT' '$ROOT/.git/objects'
  "
fi

unset GIT_OBJECT_DIRECTORY GIT_ALTERNATE_OBJECT_DIRECTORIES
if git -c "safe.directory=$ROOT" -C "$ROOT" rev-parse HEAD >/dev/null 2>&1; then
  echo "HEAD OK: $(git -c safe.directory=$ROOT -C "$ROOT" log -1 --oneline)"
  exit 0
fi

echo "HEAD still broken after merge — check $ROOT/.git manually." >&2
exit 1
