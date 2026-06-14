const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const products = await p.product.findMany({
    where: { images: { some: {} } },
    include: { category: { select:{ slug:true } }, translations: { where: { locale:'en' } } },
    orderBy: [{ categorySlug:'asc' }, { sortOrder:'asc' }],
  });
  
  console.log('=== Products WITH images (need reviews) ===');
  console.log(`Total: ${products.length}\n`);
  
  let currentCat = '';
  for (const prod of products) {
    if (prod.category.slug !== currentCat) {
      currentCat = prod.category.slug;
      console.log(`\n-- ${currentCat} --`);
    }
    const name = prod.translations[0]?.name || prod.slug;
    console.log(`  slug: ${prod.slug} | name: ${name}`);
  }
  
  await p.$disconnect();
})();
