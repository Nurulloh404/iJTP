#!/usr/bin/env bash
# 10 tadan render -> hujjat -> commit -> push. Qayta ishga tushirilsa, mavjud videolarni o'tkazib yuboradi.
# Ishlatish: reel/scripts/batch.sh [boshlanish=1] [oxiri=100]
set -u
cd "$(dirname "$0")/../.."
FROM=${1:-1}
TO=${2:-100}
BRANCH=$(git rev-parse --abbrev-ref HEAD)
for ((a = FROM; a <= TO; a += 10)); do
  b=$((a + 9)); ((b > TO)) && b=$TO
  for try in 1 2 3; do
    (cd reel && node scripts/render-all.mjs --from "$a" --to "$b") && break
    echo "render $a-$b urinish $try muvaffaqiyatsiz"
  done
  (cd reel && node scripts/make-docs.mjs)
  git add videos
  if git diff --cached --quiet; then echo "o'zgarish yo'q: $a-$b"; continue; fi
  printf -v la '%03d' "$a"; printf -v lb '%03d' "$b"
  git commit -q -F - <<MSG
Add reels $la-$lb with captions and thumbnails

Co-Authored-By: Claude <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rb2whLuKtvX6v4XNEqecsT
MSG
  ok=0
  for i in 1 2 3 4 5; do
    if git push -u origin "$BRANCH"; then ok=1; break; fi
    sleep $((2 ** i))
  done
  echo "BATCH $la-$lb push=$ok $(date +%T)"
done
echo "HAMMASI TUGADI $(date +%T)"
