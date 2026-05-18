import { defineField, defineType } from "sanity";

export const routeType = defineType({
  name: "route",
  title: "Scenic Route",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({ name: "distance", title: "Distance", type: "string" }),
    defineField({
      name: "difficulty", title: "Difficulty", type: "string",
      options: { list: ["Easy", "Moderate", "Challenging"] },
    }),
    defineField({ name: "bestTime", title: "Best Time", type: "string" }),
    defineField({ name: "stops", title: "Stops / Waypoints", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "highlights", title: "Highlights", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "coverImage", title: "Cover Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "themeColor", title: "Theme Color (hex)", type: "string" }),
    defineField({ name: "isPublished", title: "Published (Live)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "coverImage" },
  },
});
