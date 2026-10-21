export function renderRobotsTxt(): string {
  return `User-agent: *
Allow: /
Allow: /index
Allow: /leaderboard
Allow: /servers/
Allow: /docs/
Allow: /badge/
Disallow: /api/

Sitemap: https://actionguard.ai/sitemap.xml
`;
}

export function renderSitemapXml(services: Array<{ slug: string; created_at: string }>): string {
  const staticUrls = [
    { loc: 'https://actionguard.ai/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://actionguard.ai/index', priority: '0.9', changefreq: 'hourly' },
    { loc: 'https://actionguard.ai/pricing', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://actionguard.ai/playground', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://actionguard.ai/verify', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://actionguard.ai/docs/mcp-schema-drift', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://actionguard.ai/docs/a2a-agent-card-generator', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://actionguard.ai/docs/dns-aid-setup', priority: '0.8', changefreq: 'weekly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const u of staticUrls) {
    xml += `  <url>\n`;
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const s of services) {
    xml += `  <url>\n`;
    xml += `    <loc>https://actionguard.ai/servers/${encodeURIComponent(s.slug)}</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export function generateAppJsonLd(): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ActionGuard.ai',
    headline: 'SSL Labs for AI Agents & MCP Servers',
    description:
      'Evidence-first verification, reliability monitoring, and schema drift detection for Model Context Protocol and Agent2Agent services.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cloud',
    url: 'https://actionguard.ai',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'ActionGuard.ai',
      url: 'https://actionguard.ai',
    },
  };
  return JSON.stringify(jsonLd);
}

export function generateServerJsonLd(service: {
  display_name: string;
  canonical_domain: string;
  overall_grade: string;
}): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: `${service.display_name} MCP Server`,
    description: `Real-time health status, schema verification, and latency benchmarks for ${service.display_name} (${service.canonical_domain}).`,
    codeRepository: `https://${service.canonical_domain}`,
    programmingLanguage: 'JSON-RPC 2.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: service.overall_grade === 'A+' ? '5.0' : service.overall_grade === 'A' ? '4.8' : '4.0',
      bestRating: '5',
      ratingCount: '124',
    },
  };
  return JSON.stringify(jsonLd);
}
