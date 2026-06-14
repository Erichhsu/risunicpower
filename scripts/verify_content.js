const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  console.log('Reviews:', await p.review.count());
  console.log('BlogPosts:', await p.blogPost.count());
  console.log('CaseStudies:', await p.caseStudy.count());

  const dist = await p.review.groupBy({ by: ['productId'], _count: { id: true } });
  console.log('\nProducts with reviews:', dist.length);
  const counts = dist.map(x => x._count.id).sort((a, b) => a - b);
  console.log('Review distribution:', Math.min(...counts) + '-' + Math.max(...counts));

  const blogs = await p.blogPost.findMany({ select: { slug: true, publishDate: true }, where: { locale: 'en' }, orderBy: { publishDate: 'asc' } });
  console.log('\nBlogs (' + blogs.length + '):');
  blogs.forEach(b => console.log('  ' + b.publishDate.toISOString().slice(0, 7) + '  ' + b.slug));

  const cases = await p.caseStudy.findMany({ select: { slug: true, client: true, industry: true }, where: { locale: 'en' } });
  console.log('\nCase Studies (' + cases.length + '):');
  cases.forEach(c => console.log('  ' + c.slug + '  |  ' + c.client + '  |  ' + c.industry));

  await p.$disconnect();
})();
