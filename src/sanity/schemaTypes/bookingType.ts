import { defineField, defineType } from "sanity";
import { Calendar } from "lucide-react";

export const bookingType = defineType({
  name: "booking",
  title: "Booking",
  type: "document",
  icon: Calendar,
  fields: [
    defineField({
      name: "itinerary",
      title: "Itinerary",
      type: "reference",
      to: [{ type: "itinerary" }],
    }),
    defineField({ name: "customerName", title: "Customer Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email Address", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "phone", title: "Phone Number", type: "string", validation: (r) => r.required() }),
    defineField({ name: "travelDate", title: "Intended Travel Date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "durationDays", title: "Duration (Days)", type: "number", initialValue: 1 }),
    defineField({ name: "travelers", title: "Number of Travelers", type: "number", validation: (r) => r.required().min(1) }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["Pending", "Contacted", "Confirmed", "Cancelled"] },
      initialValue: "Pending",
      validation: (r) => r.required(),
    }),
    defineField({ name: "totalPrice", title: "Estimated Total Price (₹ INR)", type: "number" }),
    defineField({ name: "notes", title: "Special Requests / Notes", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "customerName", subtitle: "status", date: "travelDate" },
    prepare({ title, subtitle, date }) {
      return {
        title: title || "New Booking",
        subtitle: `${subtitle} - ${date ? new Date(date).toLocaleDateString() : ""}`,
      };
    },
  },
});
