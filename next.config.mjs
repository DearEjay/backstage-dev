// next.config.mjs
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';",
  },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};