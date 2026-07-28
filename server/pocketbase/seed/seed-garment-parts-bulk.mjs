// @ts-nocheck
// Bulk PLACEHOLDER seeder for `garment_parts` — creates records WITHOUT
// images (image field is optional in the schema). Use this to scaffold
// the correct partType / genders / baseKey relationships in bulk, then
// go into the PocketBase admin UI and attach real images / rename labels
// one by one.
//
// Counts generated:
//   - base:     10 records per baseKey  (8 baseKeys → 80 records)
//   - neckline: 50 total for women, 50 total for men (shared items count
//               toward both) → 80 records
//   - sleeve:   same pattern as neckline → 80 records
//   Total: 240 records
//
// Usage:
//   node server/pocketbase/seed/seed-garment-parts-bulk.mjs
//
// Reads admin credentials + URL from the project `.env` (same as
// seed-garment-parts.mjs). Safe to re-run — skips records that already
// exist (same partType + name + baseKey).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const COLLECTION = "garment_parts";

// ---------- minimal .env loader (same as original seed script) ----------
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

// ---------- base keys: every garment type that has a "base" part ----------
// genders here mirrors GARMENT_BASE_KEY in
// features/design/definitions/design-options.ts — pants & hat are shared
// between men and women (same baseKey), the rest are gender-specific.
const BASE_KEYS = [
  { key: "shomiz", label: "شومیز", genders: ["women"] },
  { key: "manto", label: "مانتو", genders: ["women"] },
  { key: "skirt", label: "دامن", genders: ["women"] },
  { key: "dress", label: "پیراهن زنانه", genders: ["women"] },
  { key: "shirt", label: "پیراهن مردانه", genders: ["men"] },
  { key: "tshirt", label: "تی‌شرت مردانه", genders: ["men"] },
  { key: "pants", label: "شلوار", genders: ["men", "women"] },
  { key: "hat", label: "کلاه", genders: ["men", "women"] },
];
const BASE_COUNT_PER_KEY = 10;

// ---------- necklines / sleeves: target totals per gender ----------
// shared items are visible to BOTH genders and count toward both totals,
// so shared + genderOnly = 50 for each gender.
const PART_TARGETS = {
  neckline: { shared: 20, womenOnly: 30, menOnly: 30, labelFa: "یقه" },
  sleeve: { shared: 20, womenOnly: 30, menOnly: 30, labelFa: "آستین" },
};

function toPersianDigits(n) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

// ---------- build record descriptors ----------
function buildBaseRecords() {
  const records = [];
  for (const { key, label, genders } of BASE_KEYS) {
    for (let i = 1; i <= BASE_COUNT_PER_KEY; i++) {
      records.push({
        partType: "base",
        genders,
        baseKey: key,
        name: `${key} base ${i}`,
        label: `پایه ${label} ${toPersianDigits(i)}`,
      });
    }
  }
  return records;
}

function buildPartRecords(partType) {
  const { shared, womenOnly, menOnly, labelFa } = PART_TARGETS[partType];
  const records = [];

  for (let i = 1; i <= shared; i++) {
    records.push({
      partType,
      genders: ["men", "women"],
      baseKey: "",
      name: `${partType} shared ${i}`,
      label: `${labelFa} مشترک ${toPersianDigits(i)}`,
    });
  }
  for (let i = 1; i <= womenOnly; i++) {
    records.push({
      partType,
      genders: ["women"],
      baseKey: "",
      name: `${partType} women ${i}`,
      label: `${labelFa} زنانه ${toPersianDigits(i)}`,
    });
  }
  for (let i = 1; i <= menOnly; i++) {
    records.push({
      partType,
      genders: ["men"],
      baseKey: "",
      name: `${partType} men ${i}`,
      label: `${labelFa} مردانه ${toPersianDigits(i)}`,
    });
  }
  return records;
}

function buildRecords() {
  return [
    ...buildBaseRecords(),
    ...buildPartRecords("neckline"),
    ...buildPartRecords("sleeve"),
  ];
}

// ---------- duplicate check (same rule as original seed script) ----------
async function recordExists(pb, rec) {
  const list = await pb.collection(COLLECTION).getList(1, 1, {
    filter: pb.filter(
      "partType = {:partType} && name = {:name} && baseKey = {:baseKey}",
      { partType: rec.partType, name: rec.name, baseKey: rec.baseKey }
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

  console.log(`➡️  در حال اتصال به: ${url}`);

  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  await pb.collection("_superusers").authWithPassword(email, password);

  try {
    await pb.collection(COLLECTION).getList(1, 1);
  } catch (e) {
    throw new Error(
      `کالکشن «${COLLECTION}» یافت نشد. ابتدا میگریشن را روی سرور اعمال کنید.`,
      { cause: e }
    );
  }

  const records = buildRecords();
  console.log(`🔎 ${records.length} رکورد placeholder برای ساخت (بدون عکس).`);

  let created = 0;
  let skipped = 0;

  for (const rec of records) {
    if (await recordExists(pb, rec)) {
      skipped++;
      continue;
    }

    // بدون فیلد image ساخته می‌شود — این فیلد در schema اختیاری است.
    await pb.collection(COLLECTION).create({
      partType: rec.partType,
      name: rec.name,
      label: rec.label,
      baseKey: rec.baseKey,
      genders: rec.genders,
    });

    created++;
    console.log(
      `✅ ${rec.partType.padEnd(8)} ${rec.label} [${rec.genders.join(",")}]${
        rec.baseKey ? `  baseKey=${rec.baseKey}` : ""
      }`
    );
  }

  console.log(`\n🎉 تمام شد — ساخته‌شده: ${created}، رد‌شده (تکراری): ${skipped}.`);
  console.log(
    `\n⚠️  یادآوری: این رکوردها بدون عکس ساخته شدن. حالا برو توی پنل ادمین PocketBase (کالکشن ${COLLECTION}) و برای هر کدوم عکس مناسب رو آپلود کن.`
  );
}

main().catch((err) => {
  console.error("❌ seed failed:", err);
  process.exit(1);
});
