const fs = require('fs');

function countKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys = keys.concat(countKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const basePath = 'D:\\risunicpower\\messages';
const en = JSON.parse(fs.readFileSync(`${basePath}\\en.json`, 'utf8'));
const enKeys = countKeys(en);
console.log(`en.json: ${enKeys.length} keys`);

const locales = ['zh', 'ja', 'de', 'fr', 'es', 'pt', 'ar', 'ru'];

for (const loc of locales) {
  const path = `${basePath}\\${loc}.json`;
  if (!fs.existsSync(path)) {
    console.log(`${loc}.json: MISSING`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const locKeys = countKeys(data);
  
  const missing = enKeys.filter(k => {
    const parts = k.split('.');
    let obj = data;
    for (const p of parts) {
      if (obj === undefined || obj === null) return true;
      obj = obj[p];
    }
    return obj === undefined;
  });
  
  if (missing.length === 0) {
    console.log(`${loc}.json: ${locKeys} keys — FULL ✅`);
  } else {
    console.log(`${loc}.json: ${locKeys} keys — MISSING ${missing.length}: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '...' : ''}`);
  }
}
