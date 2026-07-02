#!/bin/sh
set -e
mkdir -p /app/media /app/documents-media
chown -R nextjs:nodejs /app/media /app/documents-media
exec su-exec nextjs node server.js
