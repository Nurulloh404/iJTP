import type { Entry } from './types';

const FOOT = "Raqamlar — misol. O'zingiznikini kiriting";

export const CALCS: Entry[] = [
  {
    slug: "takroriy-savollar-vaqti",
    title: "Takroriy savollarga ketadigan vaqt (misol)",
    tag: "MISOL HISOB",
    hook: "Bir xil savolga\nqancha vaqt *ketadi?*",
    icon: "clock",
    caption: ["Misol uchun hisoblaymiz: kuniga 20 ta takroriy savol, har biriga 2 daqiqa.", "Raqamlar misol uchun olingan. O'zingizniki bilan almashtirib ko'ring."],
    tags: ["vaqtnitejash", "avtomatlashtirish"],
    body: {
      kind: "calc", heading: "Misol uchun hisoblaymiz",
      factors: [
        { label: "Kuniga takroriy savol", value: 20, unit: "ta" },
        { label: "Har biriga javob vaqti", value: 2, unit: "daqiqa" },
        { label: "Oyiga ish kuni", value: 26, unit: "kun" },
      ],
      resultDiv: 60, resultUnit: "soat", resultLabel: "Oyiga", footer: FOOT,
    },
  },
  {
    slug: "buyurtma-yozish-vaqti",
    title: "Buyurtmani qo'lda yozishga ketadigan vaqt (misol)",
    tag: "MISOL HISOB",
    hook: "Buyurtmani qo'lda\nyozish *qancha* vaqt?",
    icon: "sheet",
    caption: ["Misol: kuniga 15 buyurtma, har birini qo'lda yozishga 3 daqiqa.", "Raqamlar misol uchun. O'zingizniki bilan hisoblang."],
    tags: ["buyurtma", "vaqtnitejash"],
    body: {
      kind: "calc", heading: "Misol: buyurtmani qo'lda yozish",
      factors: [
        { label: "Kuniga buyurtma", value: 15, unit: "ta" },
        { label: "Har birini yozish", value: 3, unit: "daqiqa" },
        { label: "Oyiga kun", value: 30, unit: "kun" },
      ],
      resultDiv: 60, resultUnit: "soat", resultLabel: "Oyiga", footer: FOOT,
    },
  },
  {
    slug: "eslatma-qongiroqlari-vaqti",
    title: "Eslatma qo'ng'iroqlariga ketadigan vaqt (misol)",
    tag: "MISOL HISOB",
    hook: "Eslatma qo'ng'iroqlari\n*qancha* vaqt oladi?",
    icon: "phone",
    caption: ["Misol: kuniga 10 ta eslatma qo'ng'irog'i, har biri 2 daqiqa.", "Raqamlar misol uchun."],
    tags: ["eslatma", "vaqtnitejash"],
    body: {
      kind: "calc", heading: "Misol: eslatma qo'ng'iroqlari",
      factors: [
        { label: "Kuniga qo'ng'iroq", value: 10, unit: "ta" },
        { label: "Har biri", value: 2, unit: "daqiqa" },
        { label: "Oyiga ish kuni", value: 26, unit: "kun" },
      ],
      resultDiv: 60, resultUnit: "soat", resultLabel: "Oyiga", footer: FOOT,
    },
  },
  {
    slug: "hisobot-vaqti",
    title: "Hisobot tayyorlashga ketadigan vaqt (misol)",
    tag: "MISOL HISOB",
    hook: "Hisobot uchun\n*qancha* vaqt ketadi?",
    icon: "trend",
    caption: ["Misol: har kuni 30 daqiqa hisobotga ketadi, haftasiga 6 ish kuni."],
    tags: ["hisobot", "vaqtnitejash"],
    body: {
      kind: "calc", heading: "Misol: hisobotga ketgan vaqt",
      factors: [
        { label: "Har kuni hisobot", value: 30, unit: "daqiqa" },
        { label: "Haftasiga ish kuni", value: 6, unit: "kun" },
        { label: "Oyiga hafta", value: 4, unit: "hafta" },
      ],
      resultDiv: 60, resultUnit: "soat", resultLabel: "Oyiga", footer: FOOT,
    },
  },
  {
    slug: "javobsiz-xabarlar-yillik",
    title: "Javobsiz qolgan xabarlar bir yilda (misol)",
    tag: "MISOL HISOB",
    hook: "Javobsiz xabar,\n*yo'qolgan* imkoniyat",
    icon: "mail",
    caption: ["Misol: kuniga 3 ta xabar javobsiz qolsa, yil oxirida nechta bo'ladi?", "Raqamlar misol uchun."],
    tags: ["javobsizxabar", "sotuv"],
    body: {
      kind: "calc", heading: "Misol: javobsiz xabarlar",
      factors: [
        { label: "Kuniga javobsiz xabar", value: 3, unit: "ta" },
        { label: "Oyiga kun", value: 30, unit: "kun" },
        { label: "Yilda oy", value: 12, unit: "oy" },
      ],
      resultDiv: 1, resultUnit: "ta xabar", resultLabel: "Yilda", footer: FOOT,
    },
  },
  {
    slug: "tungi-xabarlar",
    title: "Tungi xabarlar soni (misol)",
    tag: "MISOL HISOB",
    hook: "Tungi xabarlar\n*nechta* bo'ladi?",
    icon: "moon",
    caption: ["Misol: kechasi kuniga 4 ta xabar kelsa, oyiga nechta bo'ladi?", "Raqamlar misol uchun."],
    tags: ["tungixabar", "instagrambot"],
    body: {
      kind: "calc", heading: "Misol: tungi xabarlar",
      factors: [
        { label: "Kechasi kelgan xabar", value: 4, unit: "ta" },
        { label: "Oyiga kun", value: 30, unit: "kun" },
      ],
      resultDiv: 1, resultUnit: "ta xabar", resultLabel: "Oyiga", footer: FOOT,
    },
  },
  {
    slug: "izohga-javob-vaqti",
    title: "Izohlarga javob berishga ketadigan vaqt (misol)",
    tag: "MISOL HISOB",
    hook: "Izohga javob\n*qancha* vaqt oladi?",
    icon: "chat",
    caption: ["Misol: kuniga 25 ta izohga 1 daqiqadan vaqt ketsa."],
    tags: ["izoh", "vaqtnitejash"],
    body: {
      kind: "calc", heading: "Misol: izohlarga javob",
      factors: [
        { label: "Kuniga izoh", value: 25, unit: "ta" },
        { label: "Har biriga javob", value: 1, unit: "daqiqa" },
        { label: "Oyiga kun", value: 30, unit: "kun" },
      ],
      resultDiv: 60, resultUnit: "soat", resultLabel: "Oyiga", footer: FOOT,
    },
  },
  {
    slug: "yillik-tejalgan-vaqt",
    title: "Bir yilda tejaladigan vaqt (misol)",
    tag: "MISOL HISOB",
    hook: "Bir yilda\n*qancha* vaqt tejash?",
    icon: "calendar",
    caption: ["Misol: kuniga 40 daqiqa tejalsa, bir yilda necha soat bo'ladi?", "Raqamlar misol uchun."],
    tags: ["vaqtnitejash", "samaradorlik"],
    body: {
      kind: "calc", heading: "Misol: bir yilda tejaladigan vaqt",
      factors: [
        { label: "Kuniga tejaladigan vaqt", value: 40, unit: "daqiqa" },
        { label: "Yiliga ish kuni", value: 300, unit: "kun" },
      ],
      resultDiv: 60, resultUnit: "soat", resultLabel: "Yilda", footer: FOOT,
    },
  },
  {
    slug: "mijoz-kutgan-vaqt",
    title: "Mijoz 3 soat kutsa, bu necha soniya",
    tag: "MISOL HISOB",
    hook: "Mijoz *3 soat*\nkutsa-chi?",
    icon: "clock",
    caption: ["3 soat necha soniya? Va bot javobi bilan solishtiring."],
    tags: ["tezjavob", "mijozkutadi"],
    body: {
      kind: "calc", heading: "Misol: mijoz kutgan vaqt",
      factors: [
        { label: "Kutish", value: 3, unit: "soat" },
        { label: "Soatda daqiqa", value: 60, unit: "daqiqa" },
        { label: "Daqiqada soniya", value: 60, unit: "soniya" },
      ],
      resultDiv: 1, resultUnit: "soniya", resultLabel: "3 soatda", footer: "Bot: atigi 6 soniya",
    },
  },
  {
    slug: "kuniga-1-soat-yilda",
    title: "Kuniga 1 soat takroriy ish, yilda necha soat",
    tag: "MISOL HISOB",
    hook: "Kuniga 1 soat,\nyilda *qancha?*",
    icon: "trend",
    caption: ["Misol: kuniga 1 soat takroriy ish, haftasiga 6 kun, yilda 52 hafta."],
    tags: ["samaradorlik", "avtomatlashtirish"],
    body: {
      kind: "calc", heading: "Misol: kuniga 1 soat",
      factors: [
        { label: "Kuniga takroriy ish", value: 1, unit: "soat" },
        { label: "Haftasiga kun", value: 6, unit: "kun" },
        { label: "Yilda hafta", value: 52, unit: "hafta" },
      ],
      resultDiv: 1, resultUnit: "soat", resultLabel: "Yilda", footer: FOOT,
    },
  },
];
