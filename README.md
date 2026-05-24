# openoceansportfishing.com

Static site for Capt. Jon Wendel's Marco Island fishing-charter business. Built with Astro, deployed to Cloudflare Pages.

## Stack

- Astro 6 (static, no client framework)
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- `@astrojs/sitemap` for `sitemap-index.xml`
- Cloudflare Pages for hosting (pushes to `main` auto-deploy)
- FishingBooker for booking (external listing)
- Web3Forms for the contact form
- Cloudflare Web Analytics

## Develop

```sh
cd site
npm install
npm run dev          # http://localhost:4321
npm run build        # build to site/dist/
npm run preview      # preview build locally
```

The Astro project lives in `site/`. Cloudflare Pages is configured with `site/` as the build root.
