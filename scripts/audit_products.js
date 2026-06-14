const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const cats = await p.productCategory.findMany({
    include: {
      products: {
        include: { images: true, specs: { where: { locale: 'en' } } },
      },
    },
    orderBy: { slug: 'asc' },
  });

  for (const c of cats) {
    console.log('\n📁 ' + c.slug + ' (' + (c.name_en || c.slug) + ') [' + c.products.length + ' products]');
    for (const pr of c.products) {
      console.log('  └─ ' + pr.slug);
      console.log('     Model: ' + (pr.model || '-'));
      console.log('     Power: ' + (pr.power || '-'));
      console.log('     Images: ' + pr.images.length);
      const imgs = pr.images.map(i => i.src).join(', ');
      console.log('       ' + (imgs || '(none)'));
      console.log('     Specs: ' + pr.specs.length);
    }
  }

  const total = cats.reduce((s, c) => s + c.products.length, 0);
  console.log('\n=== Total: ' + cats.length + ' categories, ' + total + ' products ===');
}

main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
