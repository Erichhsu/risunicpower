const fs = require('fs');
const en = JSON.parse(fs.readFileSync('D:\\risunicpower\\messages\\en.json', 'utf8'));
const ja = JSON.parse(fs.readFileSync('D:\\risunicpower\\messages\\ja.json', 'utf8'));

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

const enKeys = walkKeys(en);
const enOnly = enKeys.filter(k => getVal(ja,k) === undefined);
const engLeft = enKeys.filter(k => {
  const v = getVal(ja,k);
  return v !== undefined && v === getVal(en,k) && k.split('.').length > 1 && k !== 'Chat.title';
});

console.log('=== ja.json issues ===');
console.log('Missing keys:', enOnly);
console.log('Still in English:', engLeft);

// Also show the en hero subtitle for reference
console.log('\n=== en hero subtitle ===');
console.log(en.Home.hero.subtitle);
console.log('\n=== ja hero subtitle ===');
console.log(ja.Home.hero.subtitle);
