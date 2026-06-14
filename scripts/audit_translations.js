const fs = require('fs');

// Walk all keys in an object recursively
function walkKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys.push(...walkKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

// Get value at path
function getValue(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur === undefined || cur === null) return undefined;
    cur = cur[p];
  }
  return cur;
}

const basePath = 'D:\\risunicpower\\messages';
const locales = ['en', 'zh', 'ja', 'de', 'fr', 'es', 'pt', 'ar', 'ru'];
const files = {};

for (const loc of locales) {
  const path = `${basePath}\\${loc}.json`;
  files[loc] = JSON.parse(fs.readFileSync(path, 'utf8'));
}

const enKeys = walkKeys(files['en']);
console.log(`en.json has ${enKeys.length} keys`);
console.log('-----------------------------');

for (const loc of locales) {
  const locKeys = walkKeys(files[loc]);
  // Count keys that are identical to English value (suggesting untranslated fallback)
  let sameAsEn = 0;
  let missing = 0;
  const missList = [];
  
  for (const key of enKeys) {
    const enVal = getValue(files['en'], key);
    const locVal = getValue(files[loc], key);
    
    if (locVal === undefined) {
      missing++;
      if (missList.length < 10) missList.push(key);
    } else if (loc === 'en') {
      // skip self
    } else if (locVal === enVal && key.split('.').length > 1) {
      sameAsEn++;
    }
  }
  
  if (loc === 'en') {
    console.log(`en.json: ${locKeys.length} keys — SOURCE`);
  } else {
    const translated = enKeys.length - missing - sameAsEn;
    console.log(`${loc}.json: ${locKeys.length} keys`);
    console.log(`   translated: ${translated} | same-as-EN: ${sameAsEn} | missing: ${missing}`);
    if (missList.length > 0) console.log(`   missing keys: ${missList.join(', ')}${missing > 10 ? ' +' + (missing-10) + ' more' : ''}`);
    if (sameAsEn > 0 && sameAsEn === enKeys.length - missing) console.log('   ⚠️ FULL English fallback — no native translation');
  }
}
