import { defineField, defineType } from "sanity";

export const itineraryType = defineType({
  name: "itinerary",
  title: "Itinerary",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({ name: "style", title: "Travel Style", type: "string" }),
    defineField({
      name: "budget", title: "Budget Level", type: "string",
      options: { list: ["Budget-Friendly", "Mid-Range", "Premium", "Luxury"] },
    }),
    defineField({ name: "group", title: "Suitable For", type: "string", description: 'e.g. "Couples · Families"' }),
    defineField({ name: "stops", title: "Stops / Cities", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "coverImage", title: "Cover Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "themeColor", title: "Theme Color (hex)", type: "string" }),
    defineField({
      name: "dayByDayPlan", title: "Day-by-Day Plan", type: "array",
      of: [{ type: "block" }],
      description: "Full itinerary breakdown — use Heading 2 for each day (Day 1, Day 2...)",
    }),
    defineField({ name: "priceFrom", title: "Price From (₹ INR)", type: "number" }),
    defineField({ name: "isFeatured", title: "Featured on Plan Page?", type: "boolean", initialValue: false }),
    defineField({ name: "isPublished", title: "Published (Live)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "duration", media: "coverImage" },
  },
});
