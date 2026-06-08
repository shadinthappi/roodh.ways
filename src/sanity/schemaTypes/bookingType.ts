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
      title: "Pipeline Stage",
      type: "string",
      options: { list: ["New Lead", "Contacted", "Designing Trip", "Booked", "Completed", "Cancelled"] },
      initialValue: "New Lead",
      validation: (r) => r.required(),
    }),
    defineField({ name: "totalPrice", title: "Total Quoted Price (Gross Revenue ₹)", type: "number" }),
    defineField({ name: "advancePaid", title: "Advance Paid (₹) [Legacy]", type: "number", initialValue: 0 }),
    defineField({ name: "vendorCosts", title: "Estimated Vendor Costs (₹) [Legacy]", type: "number", initialValue: 0 }),
    
    // Advanced ERP Fields
    defineField({
      name: "costItems",
      title: "Cost Sheet Line Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "description", type: "string", title: "Description" },
            { name: "category", type: "string", title: "Category", options: { list: ["Hotel", "Flight", "Transport", "Guide", "Activity", "Other"] } },
            { name: "amount", type: "number", title: "Amount (₹)" },
            { name: "vendor", type: "reference", title: "Vendor", to: [{ type: "vendor" }] },
          ]
        }
      ]
    }),
    defineField({ name: "markupPercentage", title: "Agency Markup (%)", type: "number", initialValue: 0 }),
    defineField({ name: "taxPercentage", title: "Tax / GST (%)", type: "number", initialValue: 0 }),
    defineField({
      name: "paymentLog",
      title: "Payment Log",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "date", type: "date", title: "Payment Date" },
            { name: "amount", type: "number", title: "Amount (₹)" },
            { name: "method", type: "string", title: "Payment Method", options: { list: ["Bank Transfer", "Credit Card", "Cash", "UPI", "Other"] } },
            { name: "note", type: "string", title: "Reference / Note" },
          ]
        }
      ]
    }),

    defineField({ name: "invoiceNumber", title: "Invoice Number", type: "string" }),
    defineField({ name: "notes", title: "Special Requests / Traveler Notes", type: "text", rows: 3 }),
    defineField({ name: "agentNotes", title: "Internal Agent Notes (Not visible to traveler)", type: "text", rows: 4 }),
    
    // Trash Flags
    defineField({ name: "isTrashed", title: "Is Trashed?", type: "boolean", initialValue: false }),
    defineField({ name: "trashedAt", title: "Trashed At", type: "datetime" }),
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
