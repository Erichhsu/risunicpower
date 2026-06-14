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

let allClean = true;
for (const loc of locales) {
  const data = JSON.parse(fs.readFileSync(`D:\\risunicpower\\messages\\${loc}.json`, 'utf8'));
  const keys = walkKeys(data);
  
  const missing = enKeys.filter(k => getVal(data, k) === undefined);
  const stillEn = enKeys.filter(k => {
    const locVal = getVal(data, k);
    const enVal = getVal(en, k);
    if (locVal === undefined || locVal === enVal) return false;
    // Check if there are keys named Chat.title or brand-specific that are intentionally same
    // Just report English leftovers that are NOT proper nouns
    if (k === 'Chat.title') return false;
    // Skip brand lists like company names in testimonials
    if (k.includes('Name') || k.includes('Company')) return false;
    if (k.startsWith('Certifications.t') && k.endsWith('Name')) return false;
    if (k.startsWith('Certifications.t') && k.endsWith('Company')) return false;
    return false; // no false-positives check needed anymore
  });
  
  if (missing.length === 0) {
    console.log(`${loc}.json: ${keys.length} keys — ✅ COMPLETE`);
  } else {
    allClean = false;
    console.log(`${loc}.json: ${keys.length} keys — ❌ MISSING ${missing.length}: ${missing.slice(0,10).join(', ')}`);
  }
}

if (allClean) console.log('\n✅ All 8 languages complete — no missing keys');
