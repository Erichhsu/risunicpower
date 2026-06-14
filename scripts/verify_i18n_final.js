const fs = require('fs');

function walkKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) keys.push(...walkKeys(v, full));
    else keys.push(full);
  }
  return keys;
}
function getVal(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) { if (cur === undefined) return undefined; cur = cur[p]; }
  return cur;
}

const en = JSON.parse(fs.readFileSync('D:\\risunicpower\\messages\\en.json', 'utf8'));
const enKeys = walkKeys(en);
const targetCount = enKeys.length;

const locales = ['zh', 'ja', 'de', 'fr', 'es', 'pt', 'ar', 'ru'];
console.log(`en.json: ${targetCount} keys (baseline)\n`);

for (const loc of locales) {
  const data = JSON.parse(fs.readFileSync(`D:\\risunicpower\\messages\\${loc}.json`, 'utf8'));
  const keys = walkKeys(data);
  
  // Count English leftovers
  const stillEn = enKeys.filter(k => {
    const locVal = getVal(data, k);
    const enVal = getVal(en, k);
    return locVal !== undefined && locVal === enVal && k.split('.').length > 1;
  });
  
  const missing = enKeys.filter(k => getVal(data, k) === undefined);
  
  const status = (missing.length === 0 && stillEn.length === 0) ? '✅ COMPLETE' :
    (missing.length > 0) ? `❌ MISSING ${missing.length} keys` :
    `⚠️ ${stillEn.length} English leftovers`;
  
  console.log(`${loc}.json: ${keys.length} keys | ${status}`);
  if (stillEn.length > 0) console.log(`  English: ${stillEn.join(', ')}`);
  if (missing.length > 0) console.log(`  Missing: ${missing.join(', ')}`);
}
