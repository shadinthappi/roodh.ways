import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'heroes', title: 'Page Hero Images' },
    { name: 'chatbot', title: 'Chatbot Settings' },
    { name: 'socialFeed', title: 'Social Feed' },
  ],
  fields: [
    defineField({
      name: 'chatbotEnabled',
      title: 'Enable Chatbot',
      type: 'boolean',
      group: 'chatbot',
      description: 'Turn the floating chat widget on or off across the site.',
      initialValue: true,
    }),
    defineField({
      name: 'chatbotSystemPrompt',
      title: 'Chatbot System Prompt',
      type: 'text',
      group: 'chatbot',
      description: 'Customise the AI personality and behaviour. Leave blank to use the default travel-guide prompt.',
      rows: 8,
    }),
    defineField({
      name: 'internationalHero',
      title: 'International Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'destinationsHero',
      title: 'Destinations Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'experiencesHero',
      title: 'Experiences Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'routesHero',
      title: 'Routes Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'storiesHero',
      title: 'Stories Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'eventsHero',
      title: 'Events Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'visaHero',
      title: 'E-Visa Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'travelTradeHero',
      title: 'Travel Trade Page Hero',
      type: 'image',
      group: 'heroes',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'The main email address used in the footer and contact forms',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter / X URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'WhatsApp URL / Number',
      type: 'string',
      description: 'Format: https://wa.me/1234567890 or just a phone link',
    }),
    defineField({
      name: 'socialFeedImages',
      title: 'Social Feed Images',
      type: 'array',
      group: 'socialFeed',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            { name: 'tag', type: 'string', title: 'Tag / Location (e.g. Rajasthan)' },
            { name: 'color', type: 'string', title: 'Fallback Color (Tailwind class, e.g. bg-[#C0392B])', initialValue: 'bg-brand-blue' }
          ],
          preview: {
            select: {
              title: 'tag',
              media: 'image'
            }
          }
        }
      ]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
