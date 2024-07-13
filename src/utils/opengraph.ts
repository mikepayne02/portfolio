// https://github.com/sdnts/dietcode/blob/914e3970f6a0f555113768b12db3229dd822e6f1/astro.config.ts

import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import fs from 'fs/promises'
import { siteConfig } from '../site.config'
import { getFormattedDate } from './date'
import type { AstroIntegration } from 'astro'
import parseFrontmatter from 'gray-matter'
import satori from 'satori'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

const render = async ({
  title,
  profileImage,
  tags,
  date,
  coverImage
}: {
  title: string
  profileImage: ArrayBufferLike
  tags: string[]
  date: Date
  coverImage: ArrayBufferLike
}) => {
  const formattedDate = getFormattedDate(date)

  return {
    type: "div",
    key: null,
    props: {
      tw: "flex flex-col w-full h-full bg-[#18181b] text-[#fcfcfd]",
      children: [
        {
          type: "img",
          key: null,
          props: {
            tw: "rounded-full m-12",
            width: "220",
            height: "220",
            src: profileImage
          },
        },
        {
          type: "img",
          key: null,
          props: {
            tw: "absolute rounded-xl right-5 m-5",
            height: "350",
            src: coverImage
          },
        },
        {
          type: "div",
          key: null,
          props: {
            tw: "flex flex-col flex-1 w-full px-10 justify-center",
            children: [
              {
                type: "p",
                props: {
                  tw: "text-2xl mb-4",
                  children: formattedDate
                },
              },
              {
                type: "h1",
                key: null,
                props: {
                  tw: "text-6xl font-bold leading-snug text-white",
                  children: title
                },
              }
            ]
          },
        },
        {
          type: "div",
          key: null,
          props: {
            tw: "flex items-center justify-between w-full px-10 py-5 border-t border-[#60a5fa] text-xl",
            children: [
              {
                type: "div",
                key: null,
                props: {
                  tw: "flex items-center",
                  children: {
                    type: "svg",
                    key: null,
                    props: {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "100",
                      height: "100",
                      viewBox: "0 0 648 648",
                      children: {
                        type: "path",
                        key: null,
                        props: {
                          d: "M466.85,205.14c-13.08-13.08-30.46-20.28-48.96-20.28s-35.88,7.2-48.96,20.28l-90.84,90.84-44.24-44.24c-13.08-13.08-30.46-20.28-48.96-20.28s-35.88,7.2-49,20.32l-48.15,48.15c-.26.19-.5.39-.74.63l-67.31,67.31c-2.6,2.6-2.6,6.83,0,9.43,1.3,1.3,3.01,1.95,4.71,1.95s3.41-.65,4.71-1.95l26.05-26.05c25.55-23.09,58.13-24.01,80.55-1.79l39.83,39.83-65.96,65.96c-2.6,2.6-2.6,6.83,0,9.43,1.3,1.3,3.01,1.95,4.71,1.95s3.41-.65,4.71-1.95l65.96-65.96,44.16,44.16c13.08,13.07,30.46,20.28,48.95,20.28s35.88-7.2,48.95-20.28l90.85-90.85,90.84,90.84c13.08,13.08,30.46,20.28,48.96,20.28s35.88-7.2,48.96-20.28c13.08-13.08,20.28-30.47,20.28-48.96s-7.2-35.88-20.28-48.96l-139.8-139.8ZM282.87,300.76c11.5-10.36,26.22-16.03,41.82-16.03,16.71,0,32.43,6.51,44.24,18.32l44.18,44.18c-11.5,10.36-26.23,16.03-41.82,16.03-16.71,0-32.43-6.51-44.24-18.33l-44.18-44.18Z",
                          fill: "#fcfcfd",
                          "stroke-width": 0
                        },
                      }
                    },
                  }
                },
              },
              {
                type: "p",
                key: null,
                props: {
                  children: tags.map((tag) => `#${tag}`).join(' ')
                },
              },
              {
                type: "div",
                key: null,
                props: {
                  tw: "flex items-center",
                  children: [
                    {
                      type: "p",
                      key: null,
                      props: {
                        tw: "mr-4",
                        children: "by"
                      },
                    },
                    {
                      type: "p",
                      key: null,
                      props: {
                        tw: "text-2xl font-bold",
                        children: siteConfig.author
                      },
                    }
                  ]
                },
              }
            ]
          },
        }
      ]
    },
  }
}

export const og = (): AstroIntegration => ({
  name: 'og-image',
  hooks: {
    'astro:build:done': async ({ dir, pages }) => {
      try {
        await initWasm(await fs.readFile('node_modules/@resvg/resvg-wasm/index_bg.wasm'))
        // Read a custom font into an ArrayBuffer
        const firaCodeRegular = await fs.readFile(
          'src/assets/fonts/FiraCode-Regular.ttf'
        )
        const firaCodeBold = await fs.readFile(
          'src/assets/fonts/FiraCode-Bold.ttf'
        )

        const profileImage = (await fs.readFile('src/assets/profile.png')).buffer

        const ogPaths = new RegExp(`^projects/.+`)

        for (const { pathname } of pages) {
          // 1. For every resolved page, do the following:

          if (!ogPaths.test(pathname)) {
            // Skip over all pages that aren't posts and hence don't require a custom image
            continue
          }

          console.log(`\x1b[32mog:\x1b[0m Rendering ${pathname}`)
          // 3. Locate the source file for this resolved page. This depends heavily on your setup, but it should be straight-forward to do. After all, resolved pages and your source content would follow a similar structure!
          const file = await fs.readFile(
            `src/content/${pathname.slice(0, -1)}.mdx`,
          ).catch(() => fs.readFile(`src/content/${pathname.slice(0, -1)}/index.mdx`))

          // 4. Parse frontmatter for our source file, and get our title
          const { title, tags, publishDate, ogImage } = parseFrontmatter(file).data

          const coverImage = (await fs.readFile(ogImage)).buffer

          // 5. Render our SVG. The `render` function returns the JSX object that we talked about. I've separated this out just to keep things easy to follow
          const svg = await satori(
            await render({ title, profileImage, tags, coverImage, date: publishDate }),
            {
              width: 1200,
              height: 630,
              fonts: [
                {
                  name: 'Fira Code',
                  data: firaCodeRegular,
                  weight: 400
                },
                {
                  name: 'Fira Code',
                  data: firaCodeBold,
                  weight: 600
                }
              ]
            }
          )

          // 8. Write this PNG to a predictable location. I keep this right next to the page itself. That way, I can link to it easily.
          await fs.writeFile(
            `${dir.pathname}${pathname}og.png`,
            new Resvg(svg).render().asPng()
          )
        }

        // Just some fancy success message to make this plugin look like it belongs
        console.log(`\x1b[32mog:\x1b[0m Generated OpenGraph images`)
      } catch (e) {
        console.error(e)
        console.log(`\x1b[31mog:\x1b[0m OpenGraph image generation failed`)
      }
    }
  }
})
