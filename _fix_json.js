const fs = require('fs');
const locales = ['zh', 'ja'];
const descs = {
  zh: '2008年成立的工业电源制造商。CE、FCC、UL认证。',
  ja: '2008年創業の産業用電源メーカー。CE、FCC、UL認証取得。',
};
locales.forEach((locale) => {
  const f = 'messages/' + locale + '.json';
  const raw = fs.readFileSync(f, 'utf8');
  const m = JSON.parse(raw);
  m.Footer.brandDescription = descs[locale];
  fs.writeFileSync(f, JSON.stringify(m, null, 2) + '\n', 'utf8');
  console.log(locale + ': OK');
});
