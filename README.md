# Huss Valley Hub

Independent English static reference for Roblox Huss Valley codes. The public code entries are sourced from IGN and remain unverified by this site until an actual redemption test is documented.

- Repository: https://github.com/Sellingentlecats/hussvalleyhub.org
- Production branch: `codex/launch`
- Pages project: `hussvalleyhub`
- Pages hostname: https://hussvalleyhub-dkp.pages.dev/
- Intended canonical hostname: https://hussvalleyhub.org/

## Build and validate

Requires Node.js; no package installation is needed.

```powershell
npm run build
npm run check
```

Output is `dist/`. Pages serves its top-level `404.html` for unmatched routes. The build includes no single-page-app fallback and no third-party analytics apart from optional Cloudflare Web Analytics.

## Deployment

Cloudflare's attempt to create native GitHub integration returned error 8000000 on October 17, 2026. The deployed project currently uses direct upload, not automatic Git-triggered builds. Do not describe the connection as complete.

Commit and push source before each deployment. Use the existing Cloudflare credential through the local environment, never commit a credential. With an authenticated Wrangler environment:

```powershell
wrangler pages deploy dist --project-name hussvalleyhub --branch codex/launch --commit-hash (git rev-parse HEAD)
```

If a Cloudflare Web Analytics public site token is provisioned, set `CF_WEB_ANALYTICS_TOKEN` for the build; the build validates it and adds the Cloudflare beacon. This is a public beacon identifier, not the private Cloudflare API token. Web Analytics is not enabled yet: the existing API credential returned HTTP 403 for the RUM endpoint.

## Editorial maintenance

Edit the `codes` data and page bodies in `build.mjs`, retaining original sources. `Source checked` is a source-review date, not a redemption date. Never mark a code working merely because another publication does. Keep expired entries and record evidence; use Unknown when the actual expiry date is unknown. Rebuild, check, commit, push and deploy.

No contact mailbox is configured. Public corrections use GitHub Issues. Search Console submission is pending Google authorization; there is no submitted-sitemap screenshot.

## Intent map

| Route | Primary query |
| --- | --- |
| `/` | huss valley codes |
| `/how-to-redeem/` | how to redeem huss valley codes |
| `/codes-not-working/` | huss valley codes not working |
| `/code-updates/` | when do new huss valley codes release |

The archive is a section of `/code-updates/`, not another page competing with the home code list.
