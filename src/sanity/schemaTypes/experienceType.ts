import { defineField, defineType } from "sanity";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "icon", title: "Icon (Emoji)", type: "string" }),
    defineField({ name: "themeColor", title: "Theme Color (hex)", type: "string", description: "e.g. #C0392B" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "highlights", title: "Highlights", type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "mainImage", title: "Main Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "relatedDestinations", title: "Related Destinations", type: "array",
      of: [{ type: "reference", to: [{ type: "destination" }] }],
    }),
    defineField({ name: "isPublished", title: "Published (Live)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "mainImage" },
  },
});
