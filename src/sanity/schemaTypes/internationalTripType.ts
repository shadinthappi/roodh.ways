import { defineField, defineType } from "sanity";
import { Globe2 } from "lucide-react";

export const internationalTripType = defineType({
  name: "internationalTrip",
  title: "International Trip",
  type: "document",
  icon: Globe2,
  groups: [
    { name: "main", title: "Overview", default: true },
    { name: "details", title: "Trip Configuration" },
    { name: "plan", title: "Day-by-Day Plan" },
    { name: "media", title: "Visuals & Design" },
  ],
  fields: [
    defineField({ 
      name: "title", 
      title: "Trip Title", 
      type: "string", 
      group: "main",
      validation: (r) => r.required().min(5).max(120) 
    }),
    defineField({ 
      name: "slug", 
      title: "Slug (URL path)", 
      type: "slug", 
      group: "main",
      options: { source: "title" }, 
      validation: (r) => r.required() 
    }),
    defineField({ 
      name: "country", 
      title: "Country / Region", 
      type: "string", 
      group: "main",
      validation: (r) => r.required()
    }),
    defineField({ 
      name: "duration", 
      title: "Duration Description", 
      type: "string", 
      description: "e.g. '7 Days / 6 Nights'",
      group: "main",
      validation: (r) => r.required()
    }),
    defineField({ 
      name: "visaRequirement", 
      title: "Visa Requirements", 
      type: "string", 
      description: "e.g. 'Visa on Arrival', 'Schengen Visa Required'",
      group: "details" 
    }),
    defineField({ 
      name: "currency", 
      title: "Currency Info", 
      type: "string", 
      description: "e.g. 'Euro (€)'",
      group: "details" 
    }),
    defineField({ 
      name: "style", 
      title: "Travel Style / Category", 
      type: "string", 
      group: "details" 
    }),
    defineField({ 
      name: "description", 
      title: "Trip Pitch / Intro Description", 
      type: "text", 
      group: "main",
      rows: 4 
    }),
    defineField({
      name: "coverImage", 
      title: "Cover Image", 
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ 
      name: "themeColor", 
      title: "Accent Brand Color (Hex)", 
      type: "string", 
      group: "media",
      initialValue: "#3498db"
    }),
    defineField({
      name: "dayByDayPlan", 
      title: "Day-by-Day Detailed Roadmap", 
      type: "array",
      group: "plan",
      of: [{ type: "block" }],
    }),
    defineField({ 
      name: "priceFrom", 
      title: "Estimated Starting Cost (₹ INR)", 
      type: "number", 
      group: "details",
      validation: (r) => r.positive()
    }),
    defineField({ 
      name: "isFeatured", 
      title: "Featured on Homepage?", 
      type: "boolean", 
      group: "main",
      initialValue: false 
    }),
    defineField({ 
      name: "isPublished", 
      title: "Published (Live on Website)", 
      type: "boolean", 
      group: "main",
      initialValue: false 
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "country", media: "coverImage" },
  },
});
