import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Festival / Event",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "month", title: "Month(s)", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "icon", title: "Icon (Emoji)", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "coverImage", title: "Cover Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "themeColor", title: "Theme Color (hex)", type: "string" }),
    defineField({
      name: "tips", title: "Visitor Tips", type: "array",
      of: [{ type: "string" }],
      description: "Practical tips for travellers attending this event",
    }),
    defineField({ name: "isPublished", title: "Published (Live)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "name", subtitle: "month", media: "coverImage" },
  },
});
