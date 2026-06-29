#!/bin/sh
set -e
mkdir -p /app/public/media
chown -R nextjs:nodejs /app/public/media
exec su-exec nextjs node server.js
