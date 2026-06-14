const fs = require('fs');
const content = fs.readFileSync('D:\\risunicpower\\prisma\\seed_content.ts', 'utf8');

// Extract all review slug references (tuple index 0)
const slugPattern = /\['([^']+)'/g;
const slugs = [];
let m;
while ((m = slugPattern.exec(content)) !== null) {
  if (!slugs.includes(m[1])) slugs.push(m[1]);
}

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const missing = [];
  for (const s of slugs) {
    const r = await p.product.findUnique({ where: { slug: s }, select: { id: true } });
    if (!r) missing.push(s);
  }
  
  console.log(`Total unique slugs: ${slugs.length}`);
  console.log(`Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log('MISSING SLUGS:', missing);
  } else {
    console.log('All slugs OK!');
  }
  await p.$disconnect();
})();
