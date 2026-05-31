const fs = require('fs');
const f = 'src/app/[locale]/products/[category]/[slug]/page.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(
  "zh: { bp: '\\u4EA7\\u54C1\\u4E2D\\u5FC3', kf: '\\u5173\\u952E\\u7279\\u6027', ts: '\\u6280\\u672F\\u89C4\\u683C', cert: '\\u8BA4\\u8BC1\\u8D44\\u8D28', rel: '\\u76F8\\u5173\\u4EA7\\u54C1', rq: '\\u83B7\\u53D6\\u62A5\\u4EF7', back: '\\u8FD4\\u56DE {name}', atc: '\\u52A0\\u5165\\u8D2D\\u7269\\u8F66' },",
  "zh: { bp: '\u4EA7\u54C1\u4E2D\u5FC3', kf: '\u5173\u952E\u7279\u6027', ts: '\u6280\u672F\u89C4\u683C', cert: '\u8BA4\u8BC1\u8D44\u8D28', rel: '\u76F8\u5173\u4EA7\u54C1', rq: '\u83B7\u53D6\u62A5\u4EF7', back: '\u8FD4\u56DE {name}', atc: '\u52A0\u5165\u8D2D\u7269\u8F66' },"
);
c = c.replace(
  "ja: { bp: '\\u88FD\\u54C1\\u4E00\\u89A7', kf: '\\u4E3B\\u306A\\u7279\\u9577', ts: '\\u6280\\u8853\\u4ED5\\u69D8', cert: '\\u8A8D\\u8A3C', rel: '\\u95A2\\u9023\\u88FD\\u54C1', rq: '\\u898B\\u7A4D\\u3082\\u308A\\u4F9D\\u983C', back: '{name} \\u306B\\u623B\\u308B', atc: '\\u30AB\\u30FC\\u30C8\\u306B\\u5165\\u308C\\u308B' },",
  "ja: { bp: '\u88FD\u54C1\u4E00\u89A7', kf: '\u4E3B\u306A\u7279\u9577', ts: '\u6280\u8853\u4ED5\u69D8', cert: '\u8A8D\u8A3C', rel: '\u95A2\u9023\u88FD\u54C1', rq: '\u898B\u7A4D\u3082\u308A\u4F9D\u983C', back: '{name} \u306B\u623B\u308B', atc: '\u30AB\u30FC\u30C8\u306B\u5165\u308C\u308B' },"
);
c = c.replace('\&#x1F4F7;', '📷').replace('\&#x1F4E6;', '📦');
fs.writeFileSync(f, c, 'utf8');
console.log('Fixed');
