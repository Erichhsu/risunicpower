const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  console.log('=== DB Summary ===');
  console.log('Categories:', await p.productCategory.count());
  console.log('Products:', await p.product.count());
  console.log('Specs:', await p.productSpec.count());
  console.log('Images:', await p.productImage.count());
  console.log('Certs:', await p.certification.count());
  console.log('Translations:', await p.productTranslation.count());

  // Category breakdown
  const cats = await p.productCategory.findMany({
    include: { _count: { select: { products: true } } },
  });
  console.log('\n=== Categories ===');
  cats.forEach(c => console.log('  ' + c.slug + ': ' + c._count.products + ' products'));

  // Sample products with translations
  const samples = await p.product.findMany({
    take: 3,
    include: {
      translations: true,
      specs: { take: 4 },
      certifications: { take: 2 },
      images: { take: 2 },
    },
  });
  console.log('\n=== Sample Products ===');
  samples.forEach(pr => {
    console.log('  Slug: ' + pr.slug);
    console.log('  Featured: ' + pr.featured);
    console.log('  Published: ' + pr.published);
    const enTr = pr.translations.find(t => t.locale === 'en');
    console.log('  EN Name: ' + (enTr?.name || 'N/A'));
    console.log('  Specs: ' + pr.specs.map(s => s.label + '=' + s.value).join(' | '));
    console.log('  Certs: ' + pr.certifications.map(c => c.name).join(', '));
    console.log('  Images: ' + pr.images.map(i => i.url).join(', '));
    console.log('');
  });

  // Check featured products
  const featured = await p.product.findMany({
    where: { featured: true },
    include: { translations: true },
  });
  console.log('=== Featured (' + featured.length + ') ===');
  featured.forEach(f => {
    const tr = f.translations.find(t => t.locale === 'en');
    console.log('  ' + f.slug + ' | ' + (tr?.name || 'N/A'));
  });

  await p.$disconnect();
})();
