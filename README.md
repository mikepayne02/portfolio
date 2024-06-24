# Portfolio

## Features

- Hybrid SSR/static rendering
- Webcomponents
  - Dark/light mode
  - [Pagefind](https://pagefind.app/) site search
  - View count for each page using [Drizzle](https://orm.drizzle.team/) and [Cloudflare D1](https://developers.cloudflare.com/d1/)
  - Full-width image [lightbox](https://code.juliancataldo.com/component/astro-lightbox/) in mdx content
- Automatic [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [RSS feed](https://docs.astro.build/en/guides/rss/)
- Contact page with [React Email](https://react.email/)
- Comments using [Webmentions](https://indieweb.org/Webmention), cached in R2 object store
- [Rive](https://github.com/rive-app/rive-wasm) logo animation
- Static social image generation using WebAssembly
  - optimised with [sharp](https://sharp.pixelplumbing.com/) and synced to S3 for Cloudflare compatibility
  - [vercel/satori](https://github.com/vercel/satori) and [satori-html](https://github.com/natemoo-re/satori-html) to generate an SVG
  - [Resvg Wasm](https://github.com/yisibl/resvg-js) to render a PNG from the SVG
  - [MapLibre GL JS](https://maplibre.org/) and [Deck.gl](https://deck.gl/) to display the rotating map.

## Credits

Heavily modified from [astro-theme-resume](https://github.com/srleom/astro-theme-resume) and
[astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus)
