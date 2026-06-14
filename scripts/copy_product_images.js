const fs = require('fs');
const path = require('path');

const SRC = 'E:\\OpenCwork\\build_website\\外贸部\\产品图片';
const DST = 'D:\\risunicpower\\public\\images\\products';

// Folder name mapping: Chinese → category slugs
const FOLDER_MAP = {
  'POE电源': 'poe',
  'UPS': 'ups',
  '便携式储能': 'power-station',
  '单双项逆变器': 'psw-inverter',
  '微型逆变器': 'micro-inverter',
  '离网逆变器': 'off-grid-inverter',
};

// Multi-model folders → split into individual model mappings
const MULTI_MODELS = {
  'RP025 RP015': ['RP025', 'RP015'],
  'RP026 RP029 RP030W01': ['RP026', 'RP029', 'RP030W01'],
  'R0296 R0212 R0215标机长机': ['R0296', 'R0212', 'R0215'],
  'R0009 R0006': ['R0009', 'R0006'],
  'R0010 R0011': ['R0010', 'R0011'],
  'R0285 R0286': ['R0285', 'R0286'],
};

let copied = 0;
let skipped = 0;
let errors = 0;

function walkAndCopy(dir, categorySlug) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullSrc = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // This is an R-code folder
      let rcode = entry.name;

      // Handle multi-model folders
      if (MULTI_MODELS[rcode]) {
        // Copy to each model's folder
        for (const model of MULTI_MODELS[rcode]) {
          copyDirContents(fullSrc, path.join(DST, categorySlug, model));
        }
      } else {
        copyDirContents(fullSrc, path.join(DST, categorySlug, rcode));
      }
    } else if (entry.isFile() && entry.name.match(/\.(png|jpg|jpeg|webp)$/i)) {
      // Top-level images (便携式储能, 微型逆变器)
      const dstDir = path.join(DST, categorySlug, 'general');
      fs.mkdirSync(dstDir, { recursive: true });
      copyFile(fullSrc, path.join(dstDir, entry.name));
    }
  }
}

function copyDirContents(srcDir, dstDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.match(/\.(png|jpg|jpeg|webp)$/i)) {
      fs.mkdirSync(dstDir, { recursive: true });
      copyFile(path.join(srcDir, entry.name), path.join(dstDir, entry.name));
    }
  }
}

function copyFile(src, dst) {
  try {
    if (fs.existsSync(dst)) {
      skipped++;
      return;
    }
    fs.copyFileSync(src, dst);
    copied++;
    if (copied <= 20 || copied % 50 === 0) {
      console.log(`  ✓ ${path.relative(DST, dst)}`);
    }
  } catch (e) {
    errors++;
    console.error(`  ✗ ${dst}: ${e.message}`);
  }
}

// Main
console.log('📦 Copying product images...\n');

for (const [chineseName, slug] of Object.entries(FOLDER_MAP)) {
  const srcDir = path.join(SRC, chineseName);
  if (fs.existsSync(srcDir)) {
    console.log(`📁 ${chineseName} → ${slug}`);
    walkAndCopy(srcDir, slug);
  } else {
    console.log(`⚠️  Not found: ${srcDir}`);
  }
}

console.log(`\n✅ Done: ${copied} copied, ${skipped} skipped, ${errors} errors`);
