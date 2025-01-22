# Portfolio

## Features

- Hybrid SSR/static rendering
- Automatic [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [RSS feed](https://docs.astro.build/en/guides/rss/)
- View count for each page using [Drizzle](https://orm.drizzle.team/), [Cloudflare D1](https://developers.cloudflare.com/d1/), and Astro's [Server Islands](https://astro.build/blog/future-of-astro-server-islands/).
- Webcomponents for:
  - Dark/light mode
  - [Pagefind](https://pagefind.app/) site search
  - Image (and video) [lightbox](https://code.juliancataldo.com/component/astro-lightbox/) in mdx content
- Comments using [Webmentions](https://indieweb.org/Webmention), cached in R2 object store
- Bundled logo animation using [rive-canvas-single](https://github.com/rive-app/rive-wasm)
- Static social image generation based on [this guide](https://dietcode.io/p/astro-og/) using [Satori](https://github.com/vercel/satori) and [Resvg](https://github.com/vercel/satori). The resulting images are cached in a folder under `node_modules/.astro`.
- Animated map using [MapLibre GL JS](https://maplibre.org/) and [Deck.gl](https://deck.gl/). Hydration isn't necessary because an intersection observer asynchronously imports the necessary chunks.
- Contact form using [Astro Actions](https://github.com/withastro/roadmap/blob/actions/proposals/0046-actions.md) and [React Email](https://react.email/), protected by [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- Resume generated automatically using [pandoc](https://pandoc.org/)

## Environment

The following variables and secrets are required for the application to build.

```
AUTHOR_BIRTHDAY=YYYY-MM-DD
AUTHOR_EMAIL=example@example.com # Inbox for contact form
# base64-encoded json string in the format [ { "sourcePosition": [ lat, lng ], "targetPosition": [ lat, lng ] } ]
MAP_DATA=
# https://docs.maptiler.com/cloud/api/authentication-key/
MAPTILER_API_KEY=
# https://developers.cloudflare.com/turnstile/
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET=
# https://resend.com/docs/introduction
RESEND_API_KEY=
# https://webmention.io/
WEBMENTION_API_KEY=
```

These three variables are required to do local development with a remote D1 database via drizzle.

```
CLOUDFLARE_ACCOUNT_ID=
D1_TOKEN=
DATABASE_ID=
```

You will need to set the `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` repository secrets for wrangler to deploy the built site to Cloudflare Pages as part of the github action deployment workflow. You can also directly connect the repo to Cloudflare Pages, but doing so requires setting the [environment variables](#environment) in the Cloudflare dashboard.

> [!NOTE]
> I chose to encrypt my secrets using Mozilla's [SOPS](https://github.com/getsops/sops) tool so they can be safely committed to the repo.
>
> <details>
>   <summary>View changes that are needed to revert back to a basic secrets workflow</summary>
>
> 1. Remove the two steps named `Sops Binary Installer`, and `Decrypt variables` from `.github/workflows/ci.yml`.
> 2. Modify the build step so the following variables and secrets are included
>
> ```yaml
> - name: Build app
>   run: deno task build
>   env:
>     AUTHOR_BIRTHDAY: ${{ vars.AUTHOR_BIRTHDAY }}
>     AUTHOR_EMAIL: ${{ vars.AUTHOR_EMAIL }}
>     MAPTILER_API_KEY: ${{ vars.MAPTILER_API_KEY }}
>     TURNSTILE_SITE_KEY: ${{ vars.TURNSTILE_SITE_KEY }}
>     TURNSTILE_SECRET: ${{ secrets.TURNSTILE_SECRET }}
>     RESEND_API_KEY: ${{secrets.RESEND_API_KEY}}
>     WEBMENTION_API_KEY: ${{secrets.WEBMENTION_API_KEY}}
> ```
>
> 3. Set the corresponding variables and secrets in the Actions section of your repository's `Secrets and variables` settings.
> 4. Commit changes
> </details>

> [!IMPORTANT]  
> Submissions to the contact form will be sent to the author's email defined via the `AUTHOR_EMAIL` secret. This is different from the email defined in `siteConfig.contactEmail`, which populates the `from` field of the recipients' confirmation emails. contactEmail should be an address on the same domain you have configured in Resend, and shouldn't be the same as `AUTHOR_EMAIL` to protect the author's privacy.

## Credits

Heavily modified from [astro-theme-resume](https://github.com/srleom/astro-theme-resume) and
[astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus)
