const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  // Check missing slugs
  const slugs = ['psw-1200-48-230', 'psw-1200-48-110'];
  for (const s of slugs) {
    const r = await p.product.findUnique({ where: { slug: s }, select: { slug: true } });
    console.log(s, r ? 'OK' : 'MISSING');
  }
  const psw = await p.product.findMany({ where: { slug: { startsWith: 'psw-1200' } }, select: { slug: true } });
  console.log('Actual PSW-1200 slugs:', psw.map(x => x.slug));

  await p.$disconnect();
})().catch(console.error);
