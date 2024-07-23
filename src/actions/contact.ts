import Email from '@/emails/Contact.tsx'
import AuthorEmail from '@/emails/ContactAuthor.tsx'
import { siteConfig } from '@/site-config'
import { render } from '@react-email/render'
import { ActionError, defineAction, z } from 'astro:actions'
import { Resend } from 'resend'

import { AUTHOR_EMAIL, RECAPTCHA_SECRET, RESEND_API_KEY } from 'astro:env/server'

type CaptchaResponse = {
  success: boolean
  score: number
  'error-codes'?: string[]
}

const verifyEndpoint = 'https://www.google.com/recaptcha/api/siteverify'

export default defineAction({
  accept: 'form',
  input: z.object({
    fullName: z
      .string({ required_error: 'Please enter a name' })
      .min(2, 'Must be at least two characters long.'),
    email: z.string().email({ message: 'Please enter a valid email' }),
    message: z
      .string({ required_error: 'Please enter a message.' })
      .min(2, { message: 'Must be at least two characters long' }),
    captcha: z.string({ required_error: 'Please complete the captcha.' })
  }),
  handler: async ({ fullName, message, email, captcha }, ctx) => {
    const res = (await fetch(verifyEndpoint, {
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET as string,
        response: captcha, // the user's generated "Captcha" token
        remoteip: ctx.clientAddress // the user's IP address
      })
    }).then((res) => res.json())) as CaptchaResponse

    if (!res.success && res['error-codes']) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `Captcha error: ${res['error-codes'][0]!}`
      })
    }

    if (res.score < 0.7) {
      throw new ActionError({ code: 'BAD_REQUEST', message: 'Captcha failed' })
    }

    const resend = new Resend(RESEND_API_KEY)

    const firstName = fullName.split(' ')[0] ?? fullName

    await resend.emails.send({
      from: siteConfig.contactEmail,
      to: email,
      subject: 'Message Received',
      html: render(Email({ firstName }))
    })

    await resend.emails.send({
      from: siteConfig.contactEmail,
      to: AUTHOR_EMAIL,
      subject: `Message from ${fullName}`,
      reply_to: email,
      html: render(AuthorEmail({ fullName, message }))
    })

    return { name: firstName }
  }
})
