import { defineField, defineType } from "sanity";

export const storyType = defineType({
  name: "story",
  title: "Story / Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: ["Spiritual", "Heritage", "Nature", "Food & Culture", "Adventure", "Festivals"] },
    }),
    defineField({ name: "readTime", title: "Read Time", type: "string", description: 'e.g. "6 min read"' }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({
      name: "body", title: "Article Body", type: "array",
      of: [
        { type: "block" },
        {
          type: "image", options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
        },
      ],
    }),
    defineField({
      name: "coverImage", title: "Cover Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "isFeatured", title: "Featured Story?", type: "boolean", initialValue: false }),
    defineField({ name: "isPublished", title: "Published (Live)", type: "boolean", initialValue: false }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
  ],
  orderings: [{ title: "Newest First", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
