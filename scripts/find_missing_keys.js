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
function getValue(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) { if (cur === undefined) return undefined; cur = cur[p]; }
  return cur;
}

const en = JSON.parse(fs.readFileSync('D:\\risunicpower\\messages\\en.json', 'utf8'));
const enKeys = walkKeys(en);

// Find all keys missing from de.json
const de = JSON.parse(fs.readFileSync('D:\\risunicpower\\messages\\de.json', 'utf8'));
const missing = enKeys.filter(k => {
  const v = getValue(de, k);
  return v === undefined;
});

console.log('Missing from de/fr/es/pt/ar/ru (22 keys):');
missing.forEach(k => {
  const v = getValue(en, k);
  console.log(`  ${k}: ${JSON.stringify(v)}`);
});
