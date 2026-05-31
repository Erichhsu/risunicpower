const fs = require('fs');
const f = 'src/app/[locale]/cart/CartClient.tsx';
let c = fs.readFileSync(f, 'utf8');

// Fix formatPrice to accept locale
c = c.replace(
  "function formatPrice(cents: number): string {\n  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(cents / 100)\n}",
  "function formatPrice(cents: number, loc: string = 'en'): string {\n  const cur = loc === 'zh' ? 'CNY' : loc === 'ja' ? 'JPY' : 'USD'\n  return new Intl.NumberFormat(loc === 'zh' ? 'zh-CN' : loc === 'ja' ? 'ja-JP' : 'en-US', { style: 'currency', currency: cur, minimumFractionDigits: 2 }).format(cents / 100)\n}"
);

// Fix clearCart to confirm
c = c.replace(
  "          <button onClick={clearCart}",
  "          <button onClick={() => { if (window.confirm('Clear all items?')) clearCart() }}"
);

// Fix "Shipping & taxes" hardcoded -> use localeLabels
c = c.replace(
  '"Shipping & taxes calculated at checkout"',
  "localeLabels[locale]?.shipping || localeLabels.en.shipping || 'Shipping & taxes calculated at checkout'"
);

// Add shipping key to localeLabels
c = c.replace(
  "clear: 'Clear Cart' },",
  "clear: 'Clear Cart', shipping: 'Shipping & taxes calculated at checkout' },"
);
c = c.replace(
  "clear: '娓呯┖璐墿杞? },",
  "clear: '\u6E05\u7A7A\u8D2D\u7269\u8F66', shipping: '\u8FD0\u8D39\u53CA\u7A0E\u8D39\u5728\u7ED3\u7B97\u65F6\u8BA1\u7B97' },"
);
c = c.replace(
  "clear: '??' },",
  "clear: '\u30AB\u30FC\u30C8\u3092\u7A7A\u306B\u3059\u308B', shipping: '\u9001\u6599\u30FB\u7A0E\u91D1\u306F\u30EC\u30B8\u3067\u8A08\u7B97' },"
);

fs.writeFileSync(f, c, 'utf8');
console.log('Fixed CartClient');
