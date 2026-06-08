import { defineField, defineType } from "sanity";
import { Navigation } from "lucide-react";

export const itineraryType = defineType({
  name: "itinerary",
  title: "Itinerary",
  type: "document",
  icon: Navigation,
  groups: [
    { name: "main", title: "Overview", default: true },
    { name: "details", title: "Trip Configuration" },
    { name: "plan", title: "Day-by-Day Plan" },
    { name: "media", title: "Visuals & Design" },
  ],
  fields: [
    defineField({ 
      name: "title", 
      title: "Itinerary Title", 
      type: "string", 
      description: "Descriptive name of the trip plan (e.g. 'Golden Triangle & Royal Rajasthan', '7-Day Kerala Expedition')",
      group: "main",
      validation: (r) => r.required().min(5).max(120) 
    }),
    defineField({ 
      name: "slug", 
      title: "Slug (URL path)", 
      type: "slug", 
      description: "Click 'Generate' to create a search-engine friendly slug.",
      group: "main",
      options: { source: "title" }, 
      validation: (r) => r.required() 
    }),
    defineField({ 
      name: "duration", 
      title: "Duration Description", 
      type: "string", 
      description: "e.g. '7 Days / 6 Nights' or '2 Weeks'",
      group: "main",
      validation: (r) => r.required()
    }),
    defineField({ 
      name: "style", 
      title: "Travel Style / Category", 
      type: "string", 
      description: "e.g. 'Roadtrip · Heritage', 'Leisure · Scenic', 'Backpacking'",
      group: "details" 
    }),
    defineField({
      name: "budget", 
      title: "Budget Tier", 
      type: "string",
      description: "Helps users filter itineraries based on price expectations.",
      group: "details",
      options: { list: ["Budget-Friendly", "Mid-Range", "Premium", "Luxury"] },
    }),
    defineField({ 
      name: "group", 
      title: "Target Group / Ideal For", 
      type: "string", 
      description: "e.g. 'Couples · Families · Solo Travellers'",
      group: "details" 
    }),
    defineField({ 
      name: "stops", 
      title: "Stops / Cities Visited", 
      type: "array", 
      description: "Add consecutive stopping points on the route in chronological order.",
      group: "details",
      of: [{ type: "string" }],
      options: { layout: "tags" }
    }),
    defineField({ 
      name: "description", 
      title: "Trip Pitch / Intro Description", 
      type: "text", 
      description: "Write a high-level marketing overview explaining why travelers will love this plan.",
      group: "main",
      rows: 4 
    }),
    defineField({
      name: "coverImage", 
      title: "Itinerary Cover Image", 
      type: "image",
      description: "Primary visual shown on the planner layout previews.",
      group: "media",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({ 
      name: "themeColor", 
      title: "Accent Brand Color (Hex)", 
      type: "string", 
      description: "e.g. '#E67E22' to styled visual highlights in the card.",
      group: "media",
      initialValue: "#f39c12"
    }),
    defineField({
      name: "dayByDayPlan", 
      title: "Day-by-Day Detailed Roadmap", 
      type: "array",
      description: "Detailed daily agenda breakdown. Best practice: Use Heading 2 (e.g. '## Day 1: Arrival & Local Walks') to separate each day.",
      group: "plan",
      of: [{ type: "block" }],
    }),
    defineField({ 
      name: "priceFrom", 
      title: "Estimated Starting Cost (₹ INR)", 
      type: "number", 
      description: "Approximate base cost in INR per person.",
      group: "details",
      validation: (r) => r.positive()
    }),
    defineField({ 
      name: "isFeatured", 
      title: "Featured on Plan Page?", 
      type: "boolean", 
      description: "Enable this to display this itinerary as a recommended plan at the top of the travel portal.",
      group: "main",
      initialValue: false 
    }),
    defineField({ 
      name: "isPublished", 
      title: "Published (Live on Website)", 
      type: "boolean", 
      description: "Publish this itinerary to the live travel site.",
      group: "main",
      initialValue: false 
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "duration", media: "coverImage" },
  },
});
