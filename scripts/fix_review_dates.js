const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  // Date range: Mar 1 2026 to Jun 4 2026 (96 days)
  const start = new Date('2026-03-01T00:00:00+08:00').getTime();
  const end = new Date('2026-06-04T23:59:59+08:00').getTime();
  const range = end - start;

  const reviews = await p.review.findMany({ select: { id: true, rating: true } });
  console.log(`Total reviews: ${reviews.length}`);

  let dateUpdates = 0;
  let ratingUpdates = 0;

  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    // Random date between Mar 1 and Jun 4
    const randomMs = start + Math.floor(Math.random() * range);
    const randomDate = new Date(randomMs);

    // Target ~25% 4-star: roughly every 4th review gets 4 stars
    // But keep it natural — only change 5-star reviews to 4-star
    let newRating = r.rating;
    if (r.rating === 5 && Math.random() < 0.24) {
      newRating = 4;
      ratingUpdates++;
    }

    await p.review.update({
      where: { id: r.id },
      data: { createdAt: randomDate, rating: newRating },
    });
    dateUpdates++;
  }

  // Verify distribution
  const dist = await p.review.groupBy({ by: ['rating'], _count: { id: true } });
  const daySample = await p.review.findMany({ select: { createdAt: true }, take: 5, orderBy: { createdAt: 'asc' } });

  console.log(`\nDone! Date updates: ${dateUpdates}, Rating changes: ${ratingUpdates}`);
  console.log('Rating distribution:', JSON.stringify(dist));
  console.log('Earliest reviews:', daySample.map(x => x.createdAt.toISOString().slice(0, 10)));

  await p.$disconnect();
})();
