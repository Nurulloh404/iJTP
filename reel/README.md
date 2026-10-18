# Reel generator (Remotion)

Kichik biznes uchun vertikal (1080x1920, 30 fps) Instagram Reel'lar. 10 ta shablon x 10 mavzu = 100 video.
Tayyor videolar `../videos/` papkada.

## Tuzilishi

```
src/
  Root.tsx            "Reel" kompozitsiyasi, davomiylik calculateMetadata orqali
  Reel.tsx            hook -> asosiy qism -> CTA, musiqa, o'tishlar
  scenes/             Hook (4 xil animatsiya), Cta
  templates/          Chat, Flow, Versus, List, Steps, Clock, Calc, Check, Faq, Story
  content/            100 ta video matni (shablon bo'yicha fayllar), index.ts tartib va mavzuni belgilaydi
  lib/                Background, Icon (SVG), Sfx, shriftlar, yordamchilar
public/
  fonts/              Inter (SIL OFL)
  audio/              sintez qilingan musiqa (m1..m6) va SFX (scripts/make-audio.mjs)
scripts/
  make-audio.mjs      musiqa va SFX ni qayta yaratadi
  check.mjs           matn sig'ishini tekshiradi + muqova kadrlari (.check/)
  render-all.mjs      videolarni render qiladi (bundle bir marta), ovozni -16 LUFS ga keltiradi
  make-docs.mjs       captions/NNN.txt va videos/README.md ni yaratadi
```

## Ishga tushirish

```bash
cd reel
npm install
npm run studio                                   # ko'rib chiqish
node scripts/check.mjs                           # barcha videolar uchun matn sig'ishi tekshiruvi
node scripts/render-all.mjs --from 1 --to 10     # 1..10-videolarni render qilish
node scripts/render-all.mjs --ids 005 --force    # bittasini qayta render qilish
node scripts/make-docs.mjs                       # opisaniyalar va indeks
```

Muhit o'zgaruvchisi: `BROWSER_EXE` — headless Chrome yo'li (standart: Playwright'ning `chromium_headless_shell`).
`scripts/lib.mjs` da `gl: 'angle'` ishlatiladi: bu `swangle` ga nisbatan taxminan 6 barobar tez render beradi.

## Yangi video qo'shish

`src/content/<shablon>.ts` fayliga yangi yozuv qo'shing. Matn sig'maslik bo'lsa `check.mjs` xatoni aniq ko'rsatadi.
Hook matnida `\n` — yangi qator, `*so'z*` — rangli urg'u.

Remotion litsenziyasi: https://remotion.dev/license
