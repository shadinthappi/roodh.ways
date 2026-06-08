import { defineField, defineType } from "sanity";
import { Briefcase } from "lucide-react";

export const vendorType = defineType({
  name: "vendor",
  title: "Vendor / Supplier",
  type: "document",
  icon: Briefcase,
  fields: [
    defineField({
      name: "name",
      title: "Vendor Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["Hotel", "Transport / Driver", "Tour Guide", "Flight Agent", "Other"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "contactPerson",
      title: "Contact Person",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "contractRates",
      title: "Contracted Rates / Tariff link",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
    },
  },
});
