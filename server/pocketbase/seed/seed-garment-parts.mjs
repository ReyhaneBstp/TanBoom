// @ts-nocheck
// Idempotent seeder for garment_parts collection (no real images needed).
// Usage: node server/pocketbase/seed/seed-garment-parts.mjs
//
// Creates:
// - 10 base variants per garment type (shomiz, manto, dress, ...)
// - ~50 necklines for women + ~50 for men (shared ones counted in both)
// - ~50 sleeves for women + ~50 for men
// All images are the same tiny placeholder. Replace them later in PocketBase admin.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const COLLECTION = "garment_parts";

// ---------- minimal .env loader ----------
function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env");
  const raw = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

// ---------- tiny 1x1 transparent PNG as placeholder ----------
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

// ============================================================
// BASES – 10 popular variants per baseKey
// ============================================================
const BASE_VARIANTS = {
  shomiz: [
    { name: "Classic Shomiz", label: "شومیز کلاسیک" },
    { name: "Oversized Shomiz", label: "شومیز اورسایز" },
    { name: "Fitted Shomiz", label: "شومیز فیت" },
    { name: "A-Line Shomiz", label: "شومیز ای‌لاین" },
    { name: "Tunic Shomiz", label: "شومیز تونیک" },
    { name: "Peplum Shomiz", label: "شومیز پپلوم" },
    { name: "Wrap Shomiz", label: "شومیز رپ" },
    { name: "Boxy Shomiz", label: "شومیز باکسی" },
    { name: "Longline Shomiz", label: "شومیز بلند" },
    { name: "Cropped Shomiz", label: "شومیز کراپ" },
  ],
  manto: [
    { name: "Classic Manto", label: "مانتو کلاسیک" },
    { name: "Oversized Manto", label: "مانتو اورسایز" },
    { name: "Fitted Manto", label: "مانتو فیت" },
    { name: "A-Line Manto", label: "مانتو ای‌لاین" },
    { name: "Kimono Manto", label: "مانتو کیمونو" },
    { name: "Cape Manto", label: "مانتو کیپ" },
    { name: "Belted Manto", label: "مانتو کمربنددار" },
    { name: "Long Manto", label: "مانتو بلند" },
    { name: "Short Manto", label: "مانتو کوتاه" },
    { name: "Open-Front Manto", label: "مانتو جلوباز" },
  ],
  dress: [
    { name: "Shift Dress", label: "پیراهن شیفت" },
    { name: "A-Line Dress", label: "پیراهن ای‌لاین" },
    { name: "Fit and Flare Dress", label: "پیراهن فیت اند فلر" },
    { name: "Sheath Dress", label: "پیراهن شیت" },
    { name: "Wrap Dress", label: "پیراهن رپ" },
    { name: "Maxi Dress", label: "پیراهن ماکسی" },
    { name: "Midi Dress", label: "پیراهن میدی" },
    { name: "Bodycon Dress", label: "پیراهن بادی‌کان" },
    { name: "Empire Dress", label: "پیراهن امپایر" },
    { name: "Shirt Dress", label: "پیراهن شومیزی" },
  ],
  skirt: [
    { name: "A-Line Skirt", label: "دامن ای‌لاین" },
    { name: "Pencil Skirt", label: "دامن مدادی" },
    { name: "Pleated Skirt", label: "دامن پلیسه" },
    { name: "Circle Skirt", label: "دامن دایره‌ای" },
    { name: "Wrap Skirt", label: "دامن رپ" },
    { name: "Tiered Skirt", label: "دامن طبقه‌ای" },
    { name: "Midi Skirt", label: "دامن میدی" },
    { name: "Maxi Skirt", label: "دامن ماکسی" },
    { name: "Asymmetric Skirt", label: "دامن نامتقارن" },
    { name: "Godet Skirt", label: "دامن گوده" },
  ],
  pants: [
    { name: "Straight Pants", label: "شلوار راسته" },
    { name: "Wide-Leg Pants", label: "شلوار بگ" },
    { name: "Skinny Pants", label: "شلوار اسکینی" },
    { name: "Tapered Pants", label: "شلوار تیپر" },
    { name: "Palazzo Pants", label: "شلوار پالازو" },
    { name: "Cargo Pants", label: "شلوار کارگو" },
    { name: "Culottes", label: "شلوار کولوت" },
    { name: "Jogger Pants", label: "شلوار جاگر" },
    { name: "Bootcut Pants", label: "شلوار بوت‌کات" },
    { name: "High-Waisted Pants", label: "شلوار کمر‌بالا" },
  ],
  shirt: [
    { name: "Classic Dress Shirt", label: "پیراهن رسمی کلاسیک" },
    { name: "Oxford Shirt", label: "پیراهن آکسفورد" },
    { name: "Slim Fit Shirt", label: "پیراهن اسلیم" },
    { name: "Regular Fit Shirt", label: "پیراهن رگولار" },
    { name: "Oversized Shirt", label: "پیراهن اورسایز" },
    { name: "Cuban Collar Shirt", label: "پیراهن یقه کوبایی" },
    { name: "Camp Collar Shirt", label: "پیراهن کمپ" },
    { name: "Denim Shirt", label: "پیراهن جین" },
    { name: "Flannel Shirt", label: "پیراهن فلانل" },
    { name: "Linen Shirt", label: "پیراهن لنین" },
  ],
  tshirt: [
    { name: "Classic Crew T-Shirt", label: "تی‌شرت گرد کلاسیک" },
    { name: "V-Neck T-Shirt", label: "تی‌شرت یقه هفت" },
    { name: "Oversized T-Shirt", label: "تی‌شرت اورسایز" },
    { name: "Slim Fit T-Shirt", label: "تی‌شرت اسلیم" },
    { name: "Longline T-Shirt", label: "تی‌شرت لانگ‌لاین" },
    { name: "Ringer T-Shirt", label: "تی‌شرت رینگر" },
    { name: "Pocket T-Shirt", label: "تی‌شرت جیب‌دار" },
    { name: "Henley T-Shirt", label: "تی‌شرت هنلی" },
    { name: "Raglan T-Shirt", label: "تی‌شرت رگلان" },
    { name: "Boxy T-Shirt", label: "تی‌شرت باکسی" },
  ],
  hat: [
    { name: "Classic Cap", label: "کلاه کلاسیک" },
    { name: "Baseball Cap", label: "کلاه بیسبال" },
    { name: "Bucket Hat", label: "کلاه باکت" },
    { name: "Beanie", label: "کلاه بافتنی" },
    { name: "Fedora", label: "کلاه فدورا" },
    { name: "Wide-Brim Hat", label: "کلاه لبه‌پهن" },
    { name: "Newsboy Cap", label: "کلاه نیوزبوی" },
    { name: "Beret", label: "کلاه برت" },
    { name: "Trucker Cap", label: "کلاه تراکر" },
    { name: "Sun Hat", label: "کلاه آفتابی" },
  ],
};

// ============================================================
// NECKLINES
// ============================================================
const SHARED_NECKLINES = [
  { name: "Crew Neck", label: "یقه گرد ساده" },
  { name: "Round Neck", label: "یقه گرد" },
  { name: "V-Neck", label: "یقه هفت" },
  { name: "Deep V-Neck", label: "یقه هفت باز" },
  { name: "Scoop Neck", label: "یقه اسکوپ" },
  { name: "U-Neck", label: "یقه U" },
  { name: "Boat Neck", label: "یقه قایقی" },
  { name: "Bateau Neck", label: "یقه باتو" },
  { name: "High Neck", label: "یقه بلند" },
  { name: "Mock Neck", label: "یقه ایستاده کوتاه" },
  { name: "Turtleneck", label: "یقه اسکی" },
  { name: "Cowl Neck", label: "یقه آبشاری" },
  { name: "Keyhole Neck", label: "یقه کیهول" },
  { name: "Off-Shoulder", label: "یقه آف‌شولدر" },
  { name: "One-Shoulder", label: "یقه یک‌شانه" },
  { name: "Square Neck", label: "یقه چهارگوش" },
  { name: "Sweetheart Neck", label: "یقه دلبری" },
  { name: "Halter Neck", label: "یقه هالتر" },
  { name: "Mandarin Collar", label: "یقه ماندارین" },
  { name: "Peter Pan Collar", label: "یقه پیتر‌پن" },
  { name: "Shirt Collar", label: "یقه پیراهنی" },
  { name: "Spread Collar", label: "یقه اسپرت" },
  { name: "Button-Down Collar", label: "یقه دکمه‌دار" },
  { name: "Band Collar", label: "یقه بند" },
  { name: "Shawl Collar", label: "یقه شال" },
];

const WOMEN_ONLY_NECKLINES = [
  { name: "Plunging V-Neck", label: "یقه هفت گود" },
  { name: "Bardot Neck", label: "یقه باردو" },
  { name: "Illusion Neckline", label: "یقه ایلوژن" },
  { name: "Scalloped Neck", label: "یقه دندانه‌دار" },
  { name: "Asymmetric Neck", label: "یقه نامتقارن" },
  { name: "Queen Anne Neck", label: "یقه کوئین آن" },
  { name: "Jewel Neck", label: "یقه جواهر" },
  { name: "Sabrina Neck", label: "یقه سابرینا" },
  { name: "Portrait Collar", label: "یقه پرتره" },
  { name: "Ruffle Neck", label: "یقه چین‌دار" },
  { name: "Lace-Up Neck", label: "یقه بنددار" },
  { name: "Corset Neckline", label: "یقه کرست" },
  { name: "Sweetheart Illusion", label: "یقه دلبری ایلوژن" },
  { name: "Deep Scoop", label: "یقه اسکوپ عمیق" },
  { name: "Off-Shoulder Ruffle", label: "یقه آف‌شولدر چین‌دار" },
  { name: "Cold Shoulder", label: "یقه کلد شولدر" },
  { name: "Halter V-Neck", label: "یقه هالتر هفت" },
  { name: "Cross-Front Neck", label: "یقه ضربدری" },
  { name: "Twist Neck", label: "یقه پیچ‌خورده" },
  { name: "Gathered Neck", label: "یقه چین‌جمع" },
  { name: "Bow Neck", label: "یقه پاپیونی" },
  { name: "Tie-Neck", label: "یقه گره‌ای" },
  { name: "Frill Neck", label: "یقه چین‌ریز" },
  { name: "Cape Collar", label: "یقه کیپ" },
  { name: "Funnel Neck", label: "یقه فانلی" },
];

const MEN_ONLY_NECKLINES = [
  { name: "Henley Neck", label: "یقه هنلی" },
  { name: "Lace-Up Henley", label: "یقه هنلی بنددار" },
  { name: "Polo Collar", label: "یقه پولو" },
  { name: "Cuban Collar", label: "یقه کوبایی" },
  { name: "Camp Collar", label: "یقه کمپ" },
  { name: "Club Collar", label: "یقه کلاب" },
  { name: "Cutaway Collar", label: "یقه کات‌اوی" },
  { name: "Tab Collar", label: "یقه تب" },
  { name: "Pin Collar", label: "یقه پین" },
  { name: "Wingtip Collar", label: "یقه وینگ‌تیپ" },
  { name: "Nehru Collar", label: "یقه نهرو" },
  { name: "Grandad Collar", label: "یقه پدربزرگ" },
  { name: "Hidden Button-Down", label: "یقه دکمه‌مخفی" },
  { name: "Snap Button Collar", label: "یقه دکمه فشاری" },
  { name: "Stand Collar", label: "یقه ایستاده" },
  { name: "Convertible Collar", label: "یقه تبدیل‌پذیر" },
  { name: "Revere Collar", label: "یقه ریور" },
  { name: "Notch Lapel", label: "یقه ناچ لپل" },
  { name: "Peak Lapel", label: "یقه پیک لپل" },
  { name: "Shawl Lapel", label: "یقه شال لپل" },
  { name: "Mandarin Stand", label: "یقه ماندارین ایستاده" },
  { name: "Zip-Up Collar", label: "یقه زیپی" },
  { name: "Hooded Neck", label: "یقه هودی" },
  { name: "Mock Zip Collar", label: "یقه زیپ‌دار کوتاه" },
  { name: "Double Collar", label: "یقه دوبل" },
];

// ============================================================
// SLEEVES
// ============================================================
const SHARED_SLEEVES = [
  { name: "Short Sleeve", label: "آستین کوتاه" },
  { name: "Long Sleeve", label: "آستین بلند" },
  { name: "Three-Quarter Sleeve", label: "آستین سه‌ربع" },
  { name: "Cap Sleeve", label: "آستین کپ" },
  { name: "Sleeveless", label: "بدون آستین" },
  { name: "Raglan Sleeve", label: "آستین رگلان" },
  { name: "Set-In Sleeve", label: "آستین ست‌این" },
  { name: "Kimono Sleeve", label: "آستین کیمونو" },
  { name: "Dolman Sleeve", label: "آستین دولمان" },
  { name: "Bell Sleeve", label: "آستین زنگوله‌ای" },
  { name: "Puff Sleeve", label: "آستین پف‌دار" },
  { name: "Bishop Sleeve", label: "آستین بیشاپ" },
  { name: "Balloon Sleeve", label: "آستین بالونی" },
  { name: "Flared Sleeve", label: "آستین گشاد" },
  { name: "Cuffed Sleeve", label: "آستین سرآستین‌دار" },
  { name: "Roll-Up Sleeve", label: "آستین تاشو" },
  { name: "Roll-Tab Sleeve", label: "آستین رول‌تب" },
  { name: "Fitted Sleeve", label: "آستین فیت" },
  { name: "Loose Sleeve", label: "آستین آزاد" },
  { name: "Tapered Sleeve", label: "آستین تیپر" },
  { name: "Gathered Sleeve", label: "آستین چین‌دار" },
  { name: "Pleated Sleeve", label: "آستین پلیسه" },
  { name: "Slit Sleeve", label: "آستین شکاف‌دار" },
  { name: "Split Sleeve", label: "آستین دو‌تکه" },
  { name: "Cold-Shoulder Sleeve", label: "آستین کلد شولدر" },
];

const WOMEN_ONLY_SLEEVES = [
  { name: "Spaghetti Strap", label: "بند اسپاگتی" },
  { name: "Thin Strap", label: "بند نازک" },
  { name: "Wide Strap", label: "بند پهن" },
  { name: "Tank Sleeve", label: "آستین حلقه‌ای" },
  { name: "Flutter Sleeve", label: "آستین فلوتر" },
  { name: "Petal Sleeve", label: "آستین گلبرگی" },
  { name: "Lantern Sleeve", label: "آستین فانوسی" },
  { name: "Juliet Sleeve", label: "آستین ژولیت" },
  { name: "Leg-of-Mutton Sleeve", label: "آستین پاچه گوسفندی" },
  { name: "Poet Sleeve", label: "آستین شاعرانه" },
  { name: "Angel Sleeve", label: "آستین فرشته‌ای" },
  { name: "Butterfly Sleeve", label: "آستین پروانه‌ای" },
  { name: "Cape Sleeve", label: "آستین کیپ" },
  { name: "Off-Shoulder Sleeve", label: "آستین آف‌شولدر" },
  { name: "Drop Shoulder Sleeve", label: "آستین دراپ شولدر" },
  { name: "Ruffle Sleeve", label: "آستین چین‌دار" },
  { name: "Layered Sleeve", label: "آستین لایه‌ای" },
  { name: "Balloon Short Sleeve", label: "آستین کوتاه بالونی" },
  { name: "Puff Cap Sleeve", label: "آستین کپ پف‌دار" },
  { name: "Elastic Cuff Sleeve", label: "آستین مچ‌کش" },
  { name: "Tie-Cuff Sleeve", label: "آستین مچ‌گره‌ای" },
  { name: "Lace Sleeve", label: "آستین توری" },
  { name: "Sheer Sleeve", label: "آستین شیشه‌ای" },
  { name: "Illusion Sleeve", label: "آستین ایلوژن" },
  { name: "Detachable Sleeve", label: "آستین جداشدنی" },
];

const MEN_ONLY_SLEEVES = [
  { name: "Barrel Cuff Sleeve", label: "آستین سرآستین بشکه‌ای" },
  { name: "French Cuff Sleeve", label: "آستین فرنچ کاف" },
  { name: "Button Cuff Sleeve", label: "آستین دکمه کاف" },
  { name: "Convertible Cuff", label: "آستین کاف تبدیل‌پذیر" },
  { name: "Single Cuff", label: "آستین تک‌کاف" },
  { name: "Double Cuff", label: "آستین دو‌کاف" },
  { name: "Short Sleeve Camp", label: "آستین کوتاه کمپ" },
  { name: "Short Sleeve Cuban", label: "آستین کوتاه کوبایی" },
  { name: "Half Sleeve", label: "آستین نیم" },
  { name: "Elbow Sleeve", label: "آستین آرنجی" },
  { name: "Muscle Sleeve", label: "آستین ماسل" },
  { name: "Raglan Short Sleeve", label: "آستین کوتاه رگلان" },
  { name: "Baseball Sleeve", label: "آستین بیسبال" },
  { name: "Contrast Sleeve", label: "آستین کنتراست" },
  { name: "Panel Sleeve", label: "آستین پنل‌دار" },
  { name: "Zip Sleeve", label: "آستین زیپی" },
  { name: "Thumbhole Sleeve", label: "آستین شستی‌دار" },
  { name: "Ribbed Cuff Sleeve", label: "آستین مچ‌ریب" },
  { name: "Knit Cuff Sleeve", label: "آستین مچ‌بافت" },
  { name: "Tab Sleeve", label: "آستین تب‌دار" },
  { name: "Epaulet Sleeve", label: "آستین اپولت" },
  { name: "Gusset Sleeve", label: "آستین گاست" },
  { name: "Underarm Gusset", label: "آستین گاست زیربغل" },
  { name: "Articulated Sleeve", label: "آستین آرتیکولیت" },
  { name: "Vent Sleeve", label: "آستین ونت‌دار" },
];

// ---------- build all records ----------
function buildRecords() {
  const records = [];

  // --- BASES (10 per baseKey) ---
  // women-focused garments
  for (const baseKey of ["shomiz", "manto", "dress", "skirt", "pants", "hat"]) {
    for (const variant of BASE_VARIANTS[baseKey] || []) {
      records.push({
        partType: "base",
        genders: ["women"],
        baseKey,
        name: variant.name,
        label: variant.label,
      });
    }
  }
  // men-focused
  for (const baseKey of ["shirt", "tshirt", "pants", "hat"]) {
    for (const variant of BASE_VARIANTS[baseKey] || []) {
      // pants & hat already added for women → add men version with same name is ok
      // (different genders, so unique by filter)
      records.push({
        partType: "base",
        genders: ["men"],
        baseKey,
        name: variant.name,
        label: variant.label,
      });
    }
  }

  // --- NECKLINES ---
  for (const item of SHARED_NECKLINES) {
    records.push({
      partType: "neckline",
      genders: ["men", "women"],
      baseKey: "",
      name: item.name,
      label: item.label,
    });
  }
  for (const item of WOMEN_ONLY_NECKLINES) {
    records.push({
      partType: "neckline",
      genders: ["women"],
      baseKey: "",
      name: item.name,
      label: item.label,
    });
  }
  for (const item of MEN_ONLY_NECKLINES) {
    records.push({
      partType: "neckline",
      genders: ["men"],
      baseKey: "",
      name: item.name,
      label: item.label,
    });
  }

  // --- SLEEVES ---
  for (const item of SHARED_SLEEVES) {
    records.push({
      partType: "sleeve",
      genders: ["men", "women"],
      baseKey: "",
      name: item.name,
      label: item.label,
    });
  }
  for (const item of WOMEN_ONLY_SLEEVES) {
    records.push({
      partType: "sleeve",
      genders: ["women"],
      baseKey: "",
      name: item.name,
      label: item.label,
    });
  }
  for (const item of MEN_ONLY_SLEEVES) {
    records.push({
      partType: "sleeve",
      genders: ["men"],
      baseKey: "",
      name: item.name,
      label: item.label,
    });
  }

  return records;
}

async function recordExists(pb, rec) {
  const list = await pb.collection(COLLECTION).getList(1, 1, {
    filter: pb.filter(
      "partType = {:partType} && name = {:name} && baseKey = {:baseKey}",
      {
        partType: rec.partType,
        name: rec.name,
        baseKey: rec.baseKey || "",
      }
    ),
  });
  return list.totalItems > 0;
}

async function main() {
  const env = loadEnv();
  const url = env.POCKETBASE_URL;
  const email = env.POCKETBASE_ADMIN_EMAIL;
  const password = env.POCKETBASE_ADMIN_PASSWORD;

  if (!url || !email || !password) {
    throw new Error(
      "POCKETBASE_URL / POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD در .env تنظیم نشده‌اند."
    );
  }

  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  await pb.collection("_superusers").authWithPassword(email, password);

  try {
    await pb.collection(COLLECTION).getList(1, 1);
  } catch (e) {
    throw new Error(
      `کالکشن «${COLLECTION}» یافت نشد. ابتدا میگریشن را اعمال کنید.`,
      { cause: e }
    );
  }

  const records = buildRecords();
  console.log(`🔎 ${records.length} garment-part records prepared.`);

  let created = 0;
  let skipped = 0;

  for (const rec of records) {
    if (await recordExists(pb, rec)) {
      skipped++;
      continue;
    }

    const image = new File([PLACEHOLDER_PNG], "placeholder.png", {
      type: "image/png",
    });

    const form = new FormData();
    form.append("partType", rec.partType);
    form.append("name", rec.name);
    form.append("label", rec.label);
    form.append("baseKey", rec.baseKey || "");
    for (const g of rec.genders) form.append("genders", g);
    form.append("image", image);

    await pb.collection(COLLECTION).create(form);
    created++;
    console.log(
      `✅ ${rec.partType.padEnd(8)} ${rec.name.padEnd(28)} [${rec.genders.join(",")}]`
    );
  }

  console.log(`\n🎉 done — created ${created}, skipped ${skipped}.`);
  console.log(
    `   (Women necklines ≈ ${SHARED_NECKLINES.length + WOMEN_ONLY_NECKLINES.length}, Men necklines ≈ ${SHARED_NECKLINES.length + MEN_ONLY_NECKLINES.length})`
  );
  console.log(
    `   (Women sleeves ≈ ${SHARED_SLEEVES.length + WOMEN_ONLY_SLEEVES.length}, Men sleeves ≈ ${SHARED_SLEEVES.length + MEN_ONLY_SLEEVES.length})`
  );
}

main().catch((err) => {
  console.error("❌ seed failed:", err);
  process.exit(1);
});