import { defineField, defineType } from "sanity";

export const aiLogType = defineType({
  name: "aiLog",
  title: "AI Logs & Knowledge Base",
  type: "document",
  fields: [
    defineField({
      name: "feature",
      title: "Feature",
      type: "string",
      options: {
        list: [
          { title: "Chatbot", value: "Chatbot" },
          { title: "Trip Planner", value: "Trip Planner" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prompt",
      title: "User Prompt / Input",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "response",
      title: "AI Response",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isApprovedKnowledge",
      title: "Approved as Knowledge Base?",
      description: "If true, this interaction will be fed back into the AI as a positive example for future requests.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "prompt",
      subtitle: "feature",
      isApproved: "isApprovedKnowledge",
    },
    prepare(selection) {
      const { title, subtitle, isApproved } = selection;
      return {
        title: title ? (title.length > 50 ? title.substring(0, 50) + "..." : title) : "Empty Prompt",
        subtitle: `${subtitle} ${isApproved ? "⭐ (Approved)" : ""}`,
      };
    },
  },
});
