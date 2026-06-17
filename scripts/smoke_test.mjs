#!/usr/bin/env node
// =============================================================
// RisunicPower 部署前冒烟测试
// 用法: node scripts/smoke_test.mjs [baseUrl]
// 默认: http://localhost:3005
// =============================================================

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const TIMEOUT = 15000;

let passed = 0;
let failed = 0;
const results = [];

async function check(name, url, fn) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  
  try {
    const response = await page.goto(url, { timeout: TIMEOUT, waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    if (!response || response.status() !== 200) {
      throw new Error(`HTTP ${response?.status() || 'no response'}`);
    }
    
    const detail = await fn(page);
    const hasErrors = errors.length > 0 ? ` ⚠️ JS errors: ${errors.join('; ')}` : '';
    
    console.log(`  ✅ ${name}${detail ? ` — ${detail}${hasErrors}` : hasErrors}`);
    results.push({ name, status: 'PASS', detail, errors });
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name} — ${e.message}`);
    results.push({ name, status: 'FAIL', error: e.message, errors });
    failed++;
  } finally {
    await browser.close();
  }
}

// ═══════════════════════════════════════════
console.log(`\n🧪 RisunicPower Smoke Test`);
console.log(`   Target: ${BASE}`);
console.log(`   Time:   ${new Date().toISOString()}\n`);
console.log('─'.repeat(50));

// 1. 首页
await check('Homepage', `${BASE}/en`, async (page) => {
  const body = await page.evaluate(() => document.body.textContent || '');
  const checks = [
    { label: 'Hero', test: /Industrial Power/i },
    { label: 'Stats+Animation', test: /500\+.*Product SKUs/ },
    { label: 'Footer', test: /RisunicPower|risunic/i },
  ];
  const missing = checks.filter(c => !c.test.test(body)).map(c => c.label);
  if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
  return 'Hero / Stats / Footer OK';
});

// 2. 产品列表
await check('Product List', `${BASE}/en/products`, async (page) => {
  const hasCards = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/products/"]');
    return links.length;
  });
  if (hasCards < 3) throw new Error(`Only ${hasCards} product links found`);
  return `${hasCards} product links`;
});

// 3. 产品详情
await check('Product Detail', `${BASE}/en/products/all-in-one/rl550`, async (page) => {
  const body = await page.evaluate(() => document.body.textContent || '');
  if (!body.includes('RL550')) throw new Error('Product name not found');
  const hasTable = body.includes('Rated Inverter Power') || body.includes('Specification');
  const hasReviews = body.includes('Customer Review') || body.includes('Review');
  if (!hasTable) throw new Error('Specs table missing');
  if (!hasReviews) throw new Error('Reviews section missing');
  return 'Table / Reviews OK';
});

// 4. 分类页
await check('Category Page', `${BASE}/en/products/all-in-one`, async (page) => {
  const body = await page.evaluate(() => document.body.textContent || '');
  if (!body.includes('All-in-One') && !body.includes('all-in-one')) throw new Error('Category name not found');
  const products = body.match(/RL\d+|[Ee][Ss][Ss]-/g);
  if (!products || products.length < 2) throw new Error('Too few products in category');
  return `${products.length} products`;
});

// 5. 博客
await check('Blog', `${BASE}/en/blog`, async (page) => {
  const hasContent = await page.evaluate(() => {
    const articles = document.querySelectorAll('article, [class*="blog"], a[href*="/blog/"]');
    return articles.length;
  });
  if (hasContent < 1) throw new Error('No blog content found');
  return `${hasContent} articles/links`;
});

// 6. 案例
await check('Case Studies', `${BASE}/en/case-studies`, async (page) => {
  const body = await page.evaluate(() => document.body.textContent || '');
  if (!body) throw new Error('Empty page');
  return 'OK';
});

// 7. 联系表单
await check('Contact', `${BASE}/en/contact`, async (page) => {
  const hasForm = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, textarea');
    return inputs.length;
  });
  if (hasForm < 2) throw new Error('Contact form incomplete');
  return `${hasForm} form fields`;
});

// ═══════════════════════════════════════════
console.log('─'.repeat(50));
console.log(`\n📊 Results: ${passed}/${passed + failed} passed`);

results.forEach(r => {
  console.log(`  ${r.status === 'PASS' ? '✅' : '❌'} ${r.name}${r.status === 'FAIL' ? ` — ${r.error}` : ''}`);
});

console.log('');
if (failed === 0) {
  console.log('🚀 All clear — ready to deploy!\n');
} else {
  console.log('🔴 Deployment blocked — fix failures above first.\n');
}

process.exit(failed > 0 ? 1 : 0);
