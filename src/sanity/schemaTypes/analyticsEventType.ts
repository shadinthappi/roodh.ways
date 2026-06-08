import { defineField, defineType } from "sanity";

export const analyticsEventType = defineType({
  name: "analyticsEvent",
  title: "Analytics Event",
  type: "document",
  fields: [
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: { list: ["pageview", "explore"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "path",
      title: "URL Path",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "eventType", subtitle: "path" },
  },
});
