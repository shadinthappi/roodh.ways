import { defineField, defineType } from "sanity";

export const calendarEventType = defineType({
  name: "calendarEvent",
  title: "Calendar Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date (optional, for multi-day events)",
      type: "date",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "booking",
          "manual-booking",
          "holiday",
          "festival",
          "deadline",
          "reminder",
          "other",
        ],
      },
      initialValue: "other",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      description: "For bookings only",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "travelers",
      title: "Number of Travelers",
      type: "number",
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price (₹)",
      type: "number",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "color",
      title: "Color Tag",
      type: "string",
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Red", value: "red" },
          { title: "Yellow", value: "yellow" },
          { title: "Purple", value: "purple" },
          { title: "Orange", value: "orange" },
        ],
      },
      initialValue: "blue",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Pending", "Confirmed", "Completed", "Cancelled"],
      },
      initialValue: "Pending",
    }),
  ],
  preview: {
    select: { title: "title", date: "date", category: "category" },
    prepare({ title, date, category }) {
      return {
        title: title || "Untitled Event",
        subtitle: `${category} — ${date ? new Date(date).toLocaleDateString() : ""}`,
      };
    },
  },
});
