# Portfolio

## Features

- Hybrid SSR/static rendering
- Webcomponents
  - Dark/light mode
  - [Pagefind](https://pagefind.app/) site search
  - View count for each page using [Astro DB](https://astro.build/db/)
  - Full-width image [lightbox](https://code.juliancataldo.com/component/astro-lightbox/) in mdx content
- Automatic [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [RSS feed](https://docs.astro.build/en/guides/rss/)
- Contact page with [React Email](https://react.email/)
- [Expressive Code](https://expressive-code.com/) syntax highlighter
- Comments using [Webmentions](https://indieweb.org/Webmention), cached in object store
- Static social image generation using WebAssembly
  - synced to S3 for Cloudflare compatibility
  - vercel/satori to generate the SVG
  - resvg/wasm to render the SVG

## Credits

Heavily modified from [astro-theme-resume](https://github.com/srleom/astro-theme-resume) and
[astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus)
