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
const zh = JSON.parse(fs.readFileSync('D:\\risunicpower\\messages\\zh.json', 'utf8'));
const enKeys = walkKeys(en);

console.log('=== zh.json: keys still in English ===');
for (const key of enKeys) {
  const enVal = getValue(en, key);
  const zhVal = getValue(zh, key);
  if (zhVal === undefined) {
    console.log(`  MISSING: ${key} = ${JSON.stringify(enVal)}`);
  } else if (zhVal === enVal && key.split('.').length > 1) {
    console.log(`  ENGLISH: ${key} = ${JSON.stringify(enVal)}`);
  }
}

console.log('\n=== zh.json: all keys vs en ===');
// Check if there are extra keys in zh not in en
const zhKeys = walkKeys(zh);
const extra = zhKeys.filter(k => !enKeys.includes(k));
if (extra.length > 0) console.log('Extra keys:', extra);
else console.log('No extra keys — structure matches');
