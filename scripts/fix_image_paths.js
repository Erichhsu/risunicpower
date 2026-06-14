const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const p = new PrismaClient();
const PUBLIC = 'D:\\risunicpower\\public';
const PROD_IMG = path.join(PUBLIC, 'images', 'products');

// Scan disk → { category: [url_paths] }
function scanDisk() {
  const map = {};
  for (const cat of fs.readdirSync(PROD_IMG)) {
    const catDir = path.join(PROD_IMG, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    map[cat] = [];
    walk(catDir, map[cat]);
  }
  return map;
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walk(full, acc);
    } else {
      // Relative URL path from public root
      const url = '/' + path.relative(PUBLIC, full).replace(/\\/g, '/');
      acc.push(url);
    }
  }
}

async function main() {
  const disk = scanDisk();
  
  // Show what's on disk
  console.log('=== Files on disk ===');
  for (const [cat, imgs] of Object.entries(disk)) {
    console.log(`${cat}: ${imgs.length} files`);
  }

  // Delete ALL existing image records — we'll recreate them
  await p.productImage.deleteMany({});
  
  const products = await p.product.findMany({ include: { category: true } });
  
  let assigned = 0;
  let noImages = 0;

  for (const prod of products) {
    const cat = prod.category.slug;
    const available = disk[cat] || [];
    
    if (available.length === 0) {
      noImages++;
      continue;
    }
    
    // Assign one image per product, round-robin
    const idx = assigned % available.length;
    const url = available[idx];
    const filename = path.basename(url);
    const alt = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
    
    await p.productImage.create({
      data: {
        productId: prod.id,
        url,
        alt,
        sortOrder: 0,
        isPrimary: true,
      },
    });
    assigned++;
  }

  console.log(`\nAssigned: ${assigned}, No disk images: ${noImages}`);
  
  // Verify all paths exist
  const all = await p.productImage.findMany({});
  let ok = 0, broken = 0;
  for (const img of all) {
    if (fs.existsSync(path.join(PUBLIC, img.url))) {
      ok++;
    } else {
      console.log('BROKEN:', img.url);
      broken++;
    }
  }
  console.log(`\nVerification: ${ok} OK, ${broken} broken`);
  
  // Category coverage
  const cats = await p.productCategory.findMany({
    include: { _count: { select: { products: true } } },
  });
  console.log('\n=== Category Coverage ===');
  for (const c of cats) {
    const withImg = await p.product.count({
      where: { categorySlug: c.slug, images: { some: {} } },
    });
    console.log(`${c.slug}: ${withImg}/${c._count.products} have images`);
  }
  
  await p.$disconnect();
}

main();
