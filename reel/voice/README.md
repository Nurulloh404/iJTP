# Diktor ovozi (ElevenLabs, "Nodira")

- `ssenariy.mjs` — har video uchun diktor matni (hook, har element uchun bitta jumla, CTA avtomatik qo'shiladi).
- `prompts.txt` — ElevenLabs'ga to'g'ridan-to'g'ri qo'yiladigan tayyor promptlar (100 ta). Beat'lar `[pause]` bilan ajratilgan.
  `node scripts/voice-prompts.mjs --write` bilan qayta yaratiladi; `--missing` faqat ovozi yo'q videolarni chiqaradi.
- `../src/content/voice-data.json` — qayta ishlangan ovozdagi beat vaqtlari (sahnalar shu bo'yicha moslanadi).
- `../public/voice/NNN.mp3` — tayyor ovozlar.

## Ovozi yo'q videolar uchun ovoz qo'shish

1. ElevenLabs → Text to Speech → model **Eleven v4**, ovoz **Nodira** (`132QLQIkg1RJGmpicuhR`).
2. `prompts.txt` dagi promptni (`[pause]` belgilari bilan) joylab, generatsiya qiling va mp3 ni `NNN.mp3` nomi bilan bitta papkaga yuklab oling.
   Taxminan 300-400 kredit / video.
3. Qayta ishlash va render:
   ```bash
   cd reel
   node scripts/voice-ingest.mjs /yo'l/papka        # beat'larga bo'ladi, pauzalarni tenglashtiradi
   node scripts/render-all.mjs --ids 014,015 --force # ovozli versiya
   ```
`voice-ingest` har bir faylda aynan kerakli sonli pauza (`[pause]`) topilmasa xato beradi; shunda o'sha videoni qayta generatsiya qiling.
