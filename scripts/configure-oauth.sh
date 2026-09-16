#!/bin/sh
set -eu

: "${PUBLIC_URL:?Set PUBLIC_URL to the public HTTPS origin of snrld}"

if ! printf '%s\n' "$PUBLIC_URL" | grep -Eq '^https://[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?$'; then
  echo 'PUBLIC_URL must be a bare HTTPS origin without a port or trailing slash.' >&2
  exit 1
fi

sed "s|__PUBLIC_URL__|${PUBLIC_URL}|g" \
  /usr/share/nginx/html/client-metadata.template.json \
  > /usr/share/nginx/html/client-metadata.json
