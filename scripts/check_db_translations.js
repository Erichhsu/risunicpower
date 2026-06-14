const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const locales = ['en', 'zh', 'ja', 'de', 'fr', 'es', 'pt', 'ar', 'ru'];
  const r = await p.productTranslation.groupBy({ by: ['locale'], _count: { locale: true } });
  console.log('Translations by locale:');
  r.forEach(x => console.log('  ' + x.locale + ': ' + x._count.locale + ' products'));

  const total = await p.product.count({ where: { published: true } });
  console.log('Total published products:', total);

  const all = await p.product.findMany({
    where: { published: true },
    select: { slug: true, translations: { select: { locale: true } } }
  });

  console.log('\nMissing translations:');
  for (const loc of locales) {
    const missing = all.filter(pr => !pr.translations.some(t => t.locale === loc));
    if (missing.length > 0) {
      console.log('  ' + loc + ': missing ' + missing.length + ' products');
    }
  }
  await p.$disconnect();
}
main();
