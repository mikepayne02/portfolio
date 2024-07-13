# Portfolio

## Features

- Hybrid SSR/static rendering
- Webcomponents
  - Dark/light mode
  - [Pagefind](https://pagefind.app/) site search
  - View count for each page using [Drizzle](https://orm.drizzle.team/) and [Cloudflare D1](https://developers.cloudflare.com/d1/), rendered using Astro server islands.
  - Image [lightbox](https://code.juliancataldo.com/component/astro-lightbox/) in mdx content
- Automatic [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [RSS feed](https://docs.astro.build/en/guides/rss/)
- Email contact form using [React Email](https://react.email/), protected by [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- Comments using [Webmentions](https://indieweb.org/Webmention), cached in R2 object store
- [Rive](https://github.com/rive-app/rive-wasm) logo animation
- Static social image generation using [Satori] and [Resvg](https://github.com/vercel/satori), based on [this guide](https://dietcode.io/p/astro-og/).
  - [MapLibre GL JS](https://maplibre.org/) and [Deck.gl](https://deck.gl/) to display a map.

## Credits

Heavily modified from [astro-theme-resume](https://github.com/srleom/astro-theme-resume) and
[astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus)
