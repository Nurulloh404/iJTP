#!/usr/bin/env bash
# Birlashtirilgan ovozni yuklab olib, video bo'yicha kesadi va qayta ishlaydi.
# Ishlatish: scripts/voice-group.sh <raw-papka> <id1,id2,...> <url> [keyingi-guruh-idlari]
set -u
RAW=$1; IDS=$2; URL=$3; NEXT=${4:-}
cd "$(dirname "$0")/.."
FIRST=${IDS%%,*}
mkdir -p "$RAW"
curl -sS -m 150 -o "$RAW/g$FIRST.mp3" -w "g$FIRST http=%{http_code} bytes=%{size_download}\n" "$URL"
node scripts/voice-split.mjs "$RAW/g$FIRST.mp3" "$IDS" "$RAW" 2>&1 | grep -E "chegara|pauzalar|XATO|OGOH" | cut -c1-260 || true
for id in ${IDS//,/ }; do
  node scripts/voice-prep.mjs "$id" "$RAW/split/$id.mp3" 2>&1 | cut -c1-60
done
echo "$IDS DONE" >> "$RAW/../ledger.txt"
[ -n "$NEXT" ] && { echo ------; node scripts/voice-prompts.mjs --group "$NEXT"; }
