#!/usr/bin/env bash
set -euo pipefail

release_path=${1:?release path is required}
release_root=/opt/secagent-website/releases
site_root=/var/www/secagent-website

case "$release_path" in
  "$release_root"/*) ;;
  *) echo "invalid release path" >&2; exit 1 ;;
esac

test -f "$release_path/index.html"
test -d "$release_path/assets"

chown -R root:root "$release_path"
chmod 0755 "$release_path"

# Convert the legacy directory to a symlink on the first release. Future
# releases are switched by replacing a temporary symlink in one rename.
if [ -e "$site_root" ] && [ ! -L "$site_root" ]; then
  legacy_root="${site_root}.legacy.$(date +%Y%m%d%H%M%S)"
  mv "$site_root" "$legacy_root"
fi

temporary_link="${site_root}.next.$$"
trap 'rm -f "$temporary_link"' EXIT
ln -s "$release_path" "$temporary_link"
mv -Tf "$temporary_link" "$site_root"

for attempt in {1..20}; do
  if curl --fail --silent --show-error --max-time 5 http://127.0.0.1:45372/ | grep -q 'SecAgent'; then
    exit 0
  fi
  sleep 0.5
done

echo "SecAgent website did not become healthy on port 45372" >&2
exit 1
