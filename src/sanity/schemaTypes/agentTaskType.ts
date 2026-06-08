import { defineField, defineType } from "sanity";
import { CheckSquare } from "lucide-react";

export const agentTaskType = defineType({
  name: "agentTask",
  title: "Agent Task",
  type: "document",
  icon: CheckSquare,
  fields: [
    defineField({
      name: "title",
      title: "Task Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "dueDate",
      title: "Due Date",
      type: "date",
    }),
    defineField({
      name: "isCompleted",
      title: "Completed?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "relatedLead",
      title: "Related Lead / Booking",
      type: "reference",
      to: [{ type: "booking" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "dueDate",
      isCompleted: "isCompleted",
    },
    prepare({ title, subtitle, isCompleted }) {
      return {
        title: `${isCompleted ? "✅ " : "⏳ "}${title}`,
        subtitle: subtitle ? `Due: ${subtitle}` : "No due date",
      };
    },
  },
});
