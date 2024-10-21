# Portfolio

## Features

- Hybrid SSR/static rendering
- Webcomponents for:
  - Dark/light mode
  - [Pagefind](https://pagefind.app/) site search
  - View count for each page using [Drizzle](https://orm.drizzle.team/), [Cloudflare D1](https://developers.cloudflare.com/d1/), and Astro's [Server Islands](https://astro.build/blog/future-of-astro-server-islands/).
  - Image [lightbox](https://code.juliancataldo.com/component/astro-lightbox/) in mdx content
- Automatic [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [RSS feed](https://docs.astro.build/en/guides/rss/)
- Contact form using [Astro Actions](https://github.com/withastro/roadmap/blob/actions/proposals/0046-actions.md) and [React Email](https://react.email/), protected by [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- Comments using [Webmentions](https://indieweb.org/Webmention), cached in R2 object store
- [Rive](https://github.com/rive-app/rive-wasm) logo animation
- Static social image generation using [Satori] and [Resvg](https://github.com/vercel/satori), based on [this guide](https://dietcode.io/p/astro-og/). The resulting images are cached in the `node_modules/.astro` folder.
  - Animated map using [MapLibre GL JS](https://maplibre.org/) and [Deck.gl](https://deck.gl/). Hydration isn't necessary, an intersection observer dynamically imports the necessary chunks.
- [Bun](https://bun.sh/) to build the site on Github Actions

Side note: I chose to encrypt my secreets using Mozilla's [SOPS](https://github.com/getsops/sops) tool so they can be safely committed to the repo. To use a normal secrets workflow, you need to alter the deployment action. Remove the two steps named `Sops Binary Installer` `Decrypt variables`. Then add the following variables and secrets to Bun's build step:

```yaml
- name: Build app
  run: bun run build
  env:
    AUTHOR_BIRTHDAY: ${{vars.AUTHOR_BIRTHDAY }}
    AUTHOR_EMAIL: ${{vars.AUTHOR_EMAIL }}
    MAPTILER_API_KEY: ${{vars.MAPTILER_API_KEY }}
    TURNSTILE_SITE_KEY: ${{vars.TURNSTILE_SITE_KEY }}
    TURNSTILE_SECRET: ${{secrets.TURNSTILE_SECRET}}
    RESEND_API_KEY: ${{secrets.RESEND_API_KEY}}
    WEBMENTION_API_KEY: ${{secrets.WEBMENTION_API_KEY}}
```

Now set the corresponding variables and secrets in the Actions section of your repository's `Secrets and variables` settings. You will also need to set the `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` secrets for wrangler to deploy the built site to Cloudflare Pages during the final workflow step.

## Credits

Heavily modified from [astro-theme-resume](https://github.com/srleom/astro-theme-resume) and
[astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus)
