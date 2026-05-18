import { defineField, defineType } from "sanity";

export const destinationType = defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "region", title: "Region", type: "string",
      options: { list: ["North India", "South India", "East India", "West India", "Islands"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categories", title: "Categories", type: "array",
      of: [{ type: "string" }],
      options: { list: ["Heritage", "Nature", "Adventure", "Beach", "Spiritual", "Culture", "Food"] },
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "bestTime", title: "Best Time to Visit", type: "string" }),
    defineField({ name: "language", title: "Local Languages", type: "string" }),
    defineField({
      name: "mainImage", title: "Main Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "galleryImages", title: "Gallery Images", type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "mapCoordinates", title: "Map Coordinates", type: "object",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
      ],
    }),
    defineField({ name: "isFeatured", title: "Featured on Homepage?", type: "boolean", initialValue: false }),
    defineField({ name: "isPublished", title: "Published (Live)", type: "boolean", initialValue: false }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2, group: "seo" }),
  ],
  groups: [{ name: "seo", title: "SEO" }],
  preview: {
    select: { title: "name", subtitle: "region", media: "mainImage" },
  },
});
