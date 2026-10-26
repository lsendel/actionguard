export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

export function renderRssFeedXml(items: FeedItem[]): string {
  const buildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ActionGuard &bull; MCP Ecosystem Schema Drift &amp; Integrity Feed</title>
    <link>https://actionguard.ai/status</link>
    <description>Real-time schema alterations, breaking parameter mutations, and security audit updates across 43+ Model Context Protocol (MCP) servers.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="https://actionguard.ai/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="false">${item.guid}</guid>
    </item>`,
      )
      .join('')}
  </channel>
</rss>`;
}
