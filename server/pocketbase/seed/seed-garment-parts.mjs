// @ts-nocheck
// Idempotent uploader for garment-part images → PocketBase `garment_parts` collection.
//
// Usage:
//   node server/pocketbase/seed/seed-garment-parts.mjs
//
// Reads admin credentials + URL from the project `.env`. Walks `assets/garment-parts`
// and creates one record per image. Images under `both/` are stored ONCE with
// genders = ["men","women"] (no duplication). Re-running skips already-seeded records,
// so it is safe to run multiple times.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PocketBase from "pocketbase";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const ASSETS_ROOT = path.join(PROJECT_ROOT, "assets/garment-parts");
const COLLECTION = "garment_parts";

// ---------- minimal .env loader (no extra deps) ----------
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

// ---------- label maps ----------
// Necklines + sleeves keyed by filename stem.
const PART_META = {
  // necklines (shared "both")
  "BoatNeck(Bateau)": { name: "Boat Neck (Bateau)", label: "یقه قایقی" },
  CrewNeck: { name: "Crew Neck", label: "یقه گرد ساده" },
  RoundNeck: { name: "Round Neck", label: "یقه گرد" },
  ScoopNeck: { name: "Scoop Neck", label: "یقه اسکوپ" },
  BardotNeck: { name: "Bardot Neck", label: "یقهٔ بازِ روی شانه (باردو)" },
  HighNeck: { name: "High Neck", label: "یقه بلند" },
  KeyholeNeck: { name: "Keyhole Neck", label: "یقه کیهول" },
  MockNeck: { name: "Mock Neck", label: "یقه ایستاده کوتاه" },
  OffShoulder: { name: "Off-Shoulder", label: "یقه آف‌شولدر" },
  Turtleneck: { name: "Turtleneck", label: "یقه اسکی" },
  "U-Neck": { name: "U-Neck", label: "یقه U" },
  VNeck: { name: "V-Neck", label: "یقه هفت" },
  // necklines (women)
  CowlNeck: { name: "Cowl Neck", label: "یقه آبشاری" },
  "DeepV-Neck": { name: "Deep V-Neck", label: "یقه هفت باز" },
  HalterNeck: { name: "Halter Neck", label: "یقه هالتر" },
  "PlungingV-Neck": { name: "Plunging V-Neck", label: "یقه هفت گود" },
  squareNeck: { name: "Square Neck", label: "یقه چهارگوش" },
  SweetheartNeck: { name: "Sweetheart Neck", label: "یقه دلبری" },
  // necklines (men)
  "Lace-UpHenley": { name: "Lace-Up Henley", label: "یقه هنلی بنددار" },
  PeterPanCollarNeck: { name: "Peter Pan Collar", label: "یقه پیتر‌پن" },
  // sleeves (shared "both")
  "Short Sleeve Camp Shirt Sleeve": {
    name: "Short Sleeve Camp Shirt",
    label: "آستین کوتاه اسپرت",
  },
  "Three-Quarter Roll-Tab Sleeve": {
    name: "Three-Quarter Roll-Tab",
    label: "آستین سه‌ربع تاشو",
  },
  // sleeves (women)
  SpaghettiStrap: { name: "Spaghetti Strap", label: "بند اسپاگتی" },
  TankSleeve: { name: "Tank Sleeve", label: "آستین حلقه‌ای" },
  WideStrap: { name: "Wide Strap", label: "بند پهن" },
  // sleeves (men)
  "Full-Length Barrel Cuff Sleeve": {
    name: "Full-Length Barrel Cuff",
    label: "آستین بلند سرآستین‌دار",
  },
  "Short Sleeve Cuban Shirt Sleeve": {
    name: "Short Sleeve Cuban Shirt",
    label: "آستین کوتاه کوبایی",
  },
};

// Base parts keyed by baseKey (folder name). name/label do NOT depend on the
// filename (handles the base-somiz vs base-shomiz inconsistency).
const BASE_META = {
  dress: { name: "Dress Base", label: "پایه پیراهن" },
  hat: { name: "Hat Base", label: "پایه کلاه" },
  manto: { name: "Manto Base", label: "پایه مانتو" },
  pants: { name: "Pants Base", label: "پایه شلوار" },
  shomiz: { name: "Shomiz Base", label: "پایه شومیز" },
  skirt: { name: "Skirt Base", label: "پایه دامن" },
  shirt: { name: "Men's Shirt Base", label: "پایه پیراهن مردانه" },
  tshirt: { name: "T-Shirt Base", label: "پایه تی‌شرت" },
};

const GENDERS_BY_FOLDER = {
  both: ["men", "women"],
  female: ["women"],
  male: ["men"],
};

// ---------- walk assets → record descriptors ----------
function stem(file) {
  return file.replace(/\.[^.]+$/, "");
}

function buildRecords() {
  const records = [];

  for (const folder of ["both", "female", "male"]) {
    const genders = GENDERS_BY_FOLDER[folder];
    const folderPath = path.join(ASSETS_ROOT, folder);
    if (!fs.existsSync(folderPath)) continue;

    // loose files directly under the folder → necklines
    for (const file of fs.readdirSync(folderPath)) {
      const full = path.join(folderPath, file);
      if (!fs.statSync(full).isFile()) continue;
      records.push(makePartRecord("neckline", genders, file, full));
    }

    // neckline / sleeve subfolders
    for (const partType of ["neckline", "sleeve"]) {
      const sub = path.join(folderPath, partType);
      if (!fs.existsSync(sub)) continue;
      for (const file of fs.readdirSync(sub)) {
        const full = path.join(sub, file);
        if (!fs.statSync(full).isFile()) continue;
        records.push(makePartRecord(partType, genders, file, full));
      }
    }

    // base/<baseKey>/*
    const baseDir = path.join(folderPath, "base");
    if (fs.existsSync(baseDir)) {
      for (const baseKey of fs.readdirSync(baseDir)) {
        const keyDir = path.join(baseDir, baseKey);
        if (!fs.statSync(keyDir).isDirectory()) continue;
        for (const file of fs.readdirSync(keyDir)) {
          const full = path.join(keyDir, file);
          if (!fs.statSync(full).isFile()) continue;
          const meta = BASE_META[baseKey];
          if (!meta) {
            console.warn(`⚠️  no BASE_META for baseKey "${baseKey}", skipping`);
            continue;
          }
          records.push({
            partType: "base",
            genders,
            baseKey,
            name: meta.name,
            label: meta.label,
            filePath: full,
          });
        }
      }
    }
  }

  return records;
}

function makePartRecord(partType, genders, file, filePath) {
  const meta = PART_META[stem(file)];
  if (!meta) {
    console.warn(`⚠️  no PART_META for "${file}", using raw stem as label`);
  }
  return {
    partType,
    genders,
    baseKey: "",
    name: meta?.name ?? stem(file),
    label: meta?.label ?? stem(file),
    filePath,
  };
}

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

  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  await pb.collection("_superusers").authWithPassword(email, password);

  // fail fast if the collection/migration hasn't been applied yet
  try {
    await pb.collection(COLLECTION).getList(1, 1);
  } catch (e) {
    throw new Error(
      `کالکشن «${COLLECTION}» یافت نشد. ابتدا میگریشن را روی سرور اعمال کنید.`,
      { cause: e }
    );
  }

  const records = buildRecords();
  console.log(`🔎 ${records.length} garment-part image(s) discovered.`);

  let created = 0;
  let skipped = 0;

  for (const rec of records) {
    if (await recordExists(pb, rec)) {
      skipped++;
      continue;
    }

    const buffer = fs.readFileSync(rec.filePath);
    const image = new File([buffer], path.basename(rec.filePath), {
      type: "image/jpeg",
    });

    const form = new FormData();
    form.append("partType", rec.partType);
    form.append("name", rec.name);
    form.append("label", rec.label);
    form.append("baseKey", rec.baseKey);
    for (const g of rec.genders) form.append("genders", g);
    form.append("image", image);

    await pb.collection(COLLECTION).create(form);
    created++;
    console.log(
      `✅ ${rec.partType.padEnd(8)} ${rec.name} [${rec.genders.join(",")}]`
    );
  }

  console.log(`\n🎉 done — created ${created}, skipped ${skipped}.`);
}

main().catch((err) => {
  console.error("❌ seed failed:", err);
  process.exit(1);
});
