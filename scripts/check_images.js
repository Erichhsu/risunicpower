const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { join } = require('path');
const p = new PrismaClient();
(async () => {
  const imgs = await p.productImage.findMany({ include: { product: { select: { slug: true, category: { select: { slug: true } } } } } });
  
  console.log('=== All image records ===');
  for (const img of imgs) {
    const exists = fs.existsSync(join('D:\\risunicpower\\public', img.url));
    console.log(`${exists ? '✅' : '❌'} [${img.product.category.slug}] ${img.product.slug} → ${img.url}`);
  }
  
  // Category coverage
  const cats = await p.productCategory.findMany({
    include: {
      _count: { select: { products: true } },
      products: { include: { _count: { select: { images: true } } } },
    },
  });
  console.log('\n=== Category Coverage ===');
  for (const c of cats) {
    const withImg = c.products.filter(p => p._count.images > 0).length;
    console.log(`${c.slug}: ${withImg}/${c._count.products} have images`);
  }
  
  await p.$disconnect();
})();
