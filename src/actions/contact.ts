import Email from '@/emails/Contact.tsx'
import AuthorEmail from '@/emails/ContactAuthor.tsx'
import { siteConfig } from '@/site-config'
import { render } from '@react-email/render'
import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Resend } from 'resend'

import {
  AUTHOR_EMAIL,
  TURNSTILE_SECRET,
  RESEND_API_KEY
} from 'astro:env/server'

type TurnstileOutcome = {
  success: boolean
  'error-codes'?: string[]
}

export default defineAction({
  accept: 'form',
  input: z.object({
    fullName: z
      .string({ required_error: 'Please enter a name' })
      .min(2, 'Name must be at least two characters long.'),
    email: z.string().email({ message: 'Please enter a valid email' }),
    message: z
      .string({ required_error: 'Please enter a message.' })
      .min(2, { message: 'Message must be at least two characters long.' }),
    turnstile: z
      .string({ required_error: 'Please complete verification.' })
      .max(2048, 'Turnstile response is invalid.')
  }),
  handler: async ({ fullName, message, email, turnstile }, ctx) => {
    // Validate the token by calling the
    // "/siteverify" API endpoint.
    let formData = new FormData()
    formData.append('secret', TURNSTILE_SECRET)
    formData.append('response', turnstile)
    formData.append('remoteip', ctx.clientAddress)

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const result = await fetch(url, {
      body: formData,
      method: 'POST'
    })

    const outcome = (await result.json()) as TurnstileOutcome
    console.log(outcome)

    if (outcome['error-codes']?.length) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `Captcha error: ${outcome['error-codes']}`
      })
    }

    if (!outcome.success) {
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
