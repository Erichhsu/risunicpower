import { prisma } from '@/lib/db/prisma'

export async function GET() {
  const baseUrl = 'https://risunicpower.com'
  const posts = await prisma.blogPost.findMany({
    where: { locale: 'en', published: true },
    orderBy: { publishDate: 'desc' },
    take: 10,
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RisunicPower Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Power industry insights and product guides from RisunicPower</description>
    <language>en</language>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/en/blog/${p.slug}</link>
      <description><![CDATA[${p.excerpt || ''}]]></description>
      <pubDate>${p.publishDate.toUTCString()}</pubDate>
      <guid>${baseUrl}/en/blog/${p.slug}</guid>
      <category>${p.category}</category>
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
