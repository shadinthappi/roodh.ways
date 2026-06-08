"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectId, dataset } from "@/sanity/env";

// Preset Images for premium UX
const PRESET_IMAGES = [
  { name: "Taj Mahal (Heritage)", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80" },
  { name: "Kerala Backwaters (Scenic)", url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80" },
  { name: "Hampi Ruins (Heritage)", url: "https://images.unsplash.com/photo-1600100397608-f010b423b971?auto=format&fit=crop&w=1200&q=80" },
  { name: "Himalayas (Adventure)", url: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=1200&q=80" },
  { name: "Goa Beach (Coastal)", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" },
  { name: "Varanasi Ghats (Spiritual)", url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1200&q=80" },
  { name: "Jaipur Palace (Heritage)", url: "https://images.unsplash.com/photo-1477584322811-2a4fe51a2d4c?auto=format&fit=crop&w=1200&q=80" },
  { name: "Western Ghats (Scenic)", url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80" },
];

interface DocumentFormProps {
  collectionType: string;
  documentId: string; // "new" or absolute id like "drafts.xyz"
  singularLabel: string;
}

interface DayItem {
  title: string;
  description: string;
}

export default function DocumentForm({ collectionType, documentId, singularLabel }: DocumentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [days, setDays] = useState<DayItem[]>([{ title: "Day 1: Arrival & Local Walks", description: "Arrive at destination. Transfer to hotel. Rest." }]);
  const [markdownBody, setMarkdownBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // References lists
  const [destinations, setDestinations] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<any[]>([]);

  // Fetch references lists
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const destRes = await fetch("/api/admin/list?type=destination");
        if (destRes.ok) setDestinations(await destRes.json());

        const itinerRes = await fetch("/api/admin/list?type=itinerary");
        if (itinerRes.ok) setItineraries(await itinerRes.json());
      } catch (err) {
        console.error("Failed to load reference listings", err);
      }
    };
    fetchReferences();
  }, []);

  // Fetch document if editing
  useEffect(() => {
    if (documentId === "new") {
      // Set some initial values
      const initial: any = {
        _type: collectionType,
        isPublished: false,
        isFeatured: false,
      };

      if (collectionType === "destination") {
        initial.region = "North India";
        initial.categories = ["Heritage"];
        initial.mapCoordinates = { lat: 15.335, lng: 76.46 };
      } else if (collectionType === "itinerary" || collectionType === "internationalTrip") {
        initial.themeColor = "#f39c12";
        if (collectionType === "itinerary") initial.budget = "Mid-Range";
        if (collectionType === "itinerary") initial.stops = [];
      } else if (collectionType === "product") {
        initial.inStock = true;
      } else if (collectionType === "route") {
        initial.difficulty = "Moderate";
        initial.stops = [];
        initial.highlights = [];
      } else if (collectionType === "experience") {
        initial.themeColor = "#C0392B";
        initial.highlights = [];
        initial.relatedDestinations = [];
      } else if (collectionType === "event") {
        initial.tips = [];
      } else if (collectionType === "story") {
        initial.category = "Heritage";
        initial.publishedAt = new Date().toISOString();
      }

      setFormData(initial);
      setIsLoading(false);
    } else {
      const fetchDocument = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/admin/get?id=${documentId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData(data);

            // Parse PortableText Day-by-Day detailed plan if itinerary
            if ((collectionType === "itinerary" || collectionType === "internationalTrip") && data.dayByDayPlan) {
              const parsedDays = blocksToDays(data.dayByDayPlan);
              if (parsedDays.length > 0) setDays(parsedDays);
            }
            if (collectionType === "destination" && data.generalItinerary) {
              const parsedDays = blocksToDays(data.generalItinerary);
              if (parsedDays.length > 0) setDays(parsedDays);
            }

            // Parse PortableText article body if story
            if (collectionType === "story" && data.body) {
              setMarkdownBody(blocksToMarkdown(data.body));
            }
          } else {
            alert("Document not found!");
            router.push(`/admin/${collectionType}s`);
          }
        } catch (err) {
          alert("Error loading document.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDocument();
    }
  }, [documentId, collectionType, router]);

  // Two-way PortableText parsers
  const blocksToDays = (blocks: any[]): DayItem[] => {
    if (!blocks || !Array.isArray(blocks)) return [];
    const parsed: DayItem[] = [];
    let currentDay: DayItem | null = null;

    for (const block of blocks) {
      if (block._type !== "block") continue;
      const text = block.children?.map((c: any) => c.text).join("") || "";

      if (block.style === "h2" || text.startsWith("##") || text.toLowerCase().startsWith("day ")) {
        if (currentDay) parsed.push(currentDay);
        currentDay = { title: text.replace(/^##\s*/, ""), description: "" };
      } else {
        if (!currentDay) {
          currentDay = { title: "Day 1", description: "" };
        }
        currentDay.description += (currentDay.description ? "\n\n" : "") + text;
      }
    }

    if (currentDay) parsed.push(currentDay);
    return parsed;
  };

  const daysToBlocks = (dayItems: DayItem[]): any[] => {
    const blocks: any[] = [];
    dayItems.forEach((day, index) => {
      const dayKey = `day-h2-${index}`;
      blocks.push({
        _type: "block",
        _key: dayKey,
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: `${dayKey}-span`, text: day.title.trim() || `Day ${index + 1}`, marks: [] }],
      });

      if (day.description) {
        const paragraphs = day.description.split("\n\n");
        paragraphs.forEach((p, pIndex) => {
          const pKey = `day-p-${index}-${pIndex}`;
          blocks.push({
            _type: "block",
            _key: pKey,
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: `${pKey}-span`, text: p.trim(), marks: [] }],
          });
        });
      }
    });
    return blocks;
  };

  const blocksToMarkdown = (blocks: any[]): string => {
    if (!blocks || !Array.isArray(blocks)) return "";
    return blocks
      .map((block) => {
        if (block._type !== "block") return "";
        const text = block.children?.map((c: any) => c.text).join("") || "";
        if (block.style === "h2") return `## ${text}`;
        if (block.style === "h3") return `### ${text}`;
        return text;
      })
      .filter((t) => t)
      .join("\n\n");
  };

  const markdownToBlocks = (md: string): any[] => {
    const paragraphs = md.split(/\n\n+/);
    return paragraphs.map((p, index) => {
      const key = `story-block-${index}`;
      let style = "normal";
      let text = p.trim();

      if (text.startsWith("### ")) {
        style = "h3";
        text = text.replace(/^###\s+/, "");
      } else if (text.startsWith("## ")) {
        style = "h2";
        text = text.replace(/^##\s+/, "");
      }

      return {
        _type: "block",
        _key: key,
        style,
        markDefs: [],
        children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
      };
    });
  };

  // Field change handler
  const handleChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const next = { ...prev };
      const parts = path.split(".");
      let current = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) current[part] = {};
        current[part] = { ...current[part] };
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
      return next;
    });
  };

  // Generate URL slug from title/name
  const handleGenerateSlug = () => {
    const sourceText = formData.name || formData.title || "";
    if (!sourceText) {
      alert("Please enter a Name or Title first to generate a slug.");
      return;
    }
    const slug = sourceText
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    handleChange("slug.current", slug);
  };

  const handleArrayAdd = (field: string) => {
    const list = formData[field] || [];
    handleChange(field, [...list, ""]);
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const list = [...(formData[field] || [])];
    list[index] = value;
    handleChange(field, list);
  };

  const handleArrayRemove = (field: string, index: number) => {
    const list = [...(formData[field] || [])];
    list.splice(index, 1);
    handleChange(field, list);
  };

  // Complex array handlers (Things To Do)
  const handleThingToDoAdd = () => {
    const list = formData.thingsToDo || [];
    handleChange("thingsToDo", [...list, { title: "", image: "" }]);
  };

  const handleThingToDoChange = (index: number, field: string, value: any) => {
    const list = [...(formData.thingsToDo || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange("thingsToDo", list);
  };

  const handleThingToDoRemove = (index: number) => {
    const list = [...(formData.thingsToDo || [])];
    list.splice(index, 1);
    handleChange("thingsToDo", list);
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const finalDoc = { ...formData };

      // Ensure slug structure matches what Sanity expects
      if (finalDoc.slug && typeof finalDoc.slug === "object") {
        finalDoc.slug = { _type: "slug", current: finalDoc.slug.current };
      }

      // 1. If itinerary or internationalTrip, compile dayByDayPlan
      if (collectionType === "itinerary" || collectionType === "internationalTrip") {
        finalDoc.dayByDayPlan = daysToBlocks(days);
      }
      if (collectionType === "destination") {
        finalDoc.generalItinerary = daysToBlocks(days);
      }

      // 2. If story, compile article body
      if (collectionType === "story") {
        finalDoc.body = markdownToBlocks(markdownBody);
      }

      // Extract base ID and set final ID based on publication status
      const isPublished = !!finalDoc.isPublished;
      const baseId = documentId === "new"
        ? `${collectionType}-${Date.now()}`
        : (documentId.startsWith("drafts.") ? documentId.substring(7) : documentId);

      const finalId = isPublished ? baseId : `drafts.${baseId}`;
      finalDoc._id = finalId;

      // Create API payload with mutation transaction
      const mutations: any[] = [
        {
          createOrReplace: finalDoc,
        },
      ];

      // Delete alternative version to ensure single-document consistency
      if (isPublished) {
        mutations.push({
          delete: { id: `drafts.${baseId}` },
        });
      } else {
        mutations.push({
          delete: { id: baseId },
        });
      }

      const payload = {
        mutations,
      };

      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`${singularLabel} saved successfully!`);
        router.push(`/admin/${collectionType}s`);
        router.refresh();
      } else {
        alert(`Failed to save: ${data.message || data.error || "Unknown database error"}`);
      }
    } catch (err) {
      alert("Error sending mutation request.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 border border-brand-dark/10 bg-brand-white rounded-3xl flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
        <p className="text-xs text-brand-dark/70 font-semibold">Querying details for {singularLabel}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-brand-dark/70 font-bold">
            <span className="cursor-pointer hover:text-brand-dark" onClick={() => router.push(`/admin/${collectionType}s`)}>
              {singularLabel}s
            </span>
            <span>/</span>
            <span className="text-brand-dark/90">{documentId === "new" ? "New" : "Edit"}</span>
          </div>
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight mt-1">
            {documentId === "new" ? `Create New ${singularLabel}` : `Edit ${singularLabel}`}
          </h2>
        </div>
        <button
          onClick={() => router.push(`/admin/${collectionType}s`)}
          className="px-4 py-2 rounded-xl border border-brand-dark/20 hover:border-brand-dark/30 bg-brand-offwhite text-xs font-bold text-brand-dark transition-all"
        >
          Cancel
        </button>
      </div>

      {/* Editor Tabs Navigation */}
      <div className="flex border-b border-brand-dark/10 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("basic")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "basic" ? "border-brand-blue text-brand-blue" : "border-transparent text-brand-dark/60 hover:text-brand-dark"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          Overview & Metadata
        </button>
        {(collectionType === "itinerary" || collectionType === "internationalTrip" || collectionType === "destination") && (
          <button
            onClick={() => setActiveTab("itinerary-plan")}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "itinerary-plan" ? "border-brand-blue text-brand-blue" : "border-transparent text-brand-dark/60 hover:text-brand-dark"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Detailed Roadmap
          </button>
        )}
        {collectionType === "story" && (
          <button
            onClick={() => setActiveTab("story-body")}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "story-body" ? "border-brand-blue text-brand-blue" : "border-transparent text-brand-dark/60 hover:text-brand-dark"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Article Content
          </button>
        )}
        <button
          onClick={() => setActiveTab("media-design")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "media-design" ? "border-brand-blue text-brand-blue" : "border-transparent text-brand-dark/60 hover:text-brand-dark"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.35848 19.508 5.4856 20.2644 5.17647 20.9126C5.07409 21.1273 5 21.36 5 21.6c0 .22.18.4.4.4H12z"></path>
          </svg>
          Pictures & Design
        </button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-brand-dark/10 bg-brand-white rounded-3xl p-8 space-y-6">
          {/* TAB 1: BASIC & METADATA */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              {/* Row 1: Name / Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {"name" in formData || collectionType === "destination" || collectionType === "experience" || collectionType === "route" || collectionType === "event" || collectionType === "product" ? (
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      {singularLabel} Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. Golden Temple, Hampi, Kerala Backwaters..."
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      {singularLabel} Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g. Royal Rajasthan Tour..."
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2 flex justify-between">
                    <span>URL Slug *</span>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[10px] text-brand-blue hover:text-brand-blue/80 font-extrabold uppercase tracking-wide flex items-center gap-1"
                    >
                      <svg className="w-3 h-3 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      Generate Slug
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug?.current || ""}
                    onChange={(e) => handleChange("slug.current", e.target.value)}
                    placeholder="e.g. royal-rajasthan-tour"
                    className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue font-mono"
                  />
                </div>
              </div>

              {/* Tagline */}
              {"tagline" in formData || collectionType !== "story" ? (
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                    Tagline / One-liner Pitch
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ""}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                    placeholder="A descriptive short sentence about this item"
                    className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue"
                  />
                </div>
              ) : null}

              {/* Destination Specific Fields */}
              {collectionType === "destination" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-dark/10 pt-6">
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Region / Area *
                    </label>
                    <select
                      value={formData.region || ""}
                      onChange={(e) => handleChange("region", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue"
                    >
                      {["North India", "South India", "East India", "West India", "Islands"].map((r) => (
                        <option key={r} value={r} className="bg-brand-white text-brand-dark">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Best Time to Visit
                    </label>
                    <input
                      type="text"
                      value={formData.bestTime || ""}
                      onChange={(e) => handleChange("bestTime", e.target.value)}
                      placeholder="e.g. October to March"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Local Language
                    </label>
                    <input
                      type="text"
                      value={formData.language || ""}
                      onChange={(e) => handleChange("language", e.target.value)}
                      placeholder="e.g. Kannada, English, Hindi"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-brand-dark uppercase tracking-wider mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.mapCoordinates?.lat || ""}
                        onChange={(e) => handleChange("mapCoordinates.lat", parseFloat(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-brand-dark uppercase tracking-wider mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.mapCoordinates?.lng || ""}
                        onChange={(e) => handleChange("mapCoordinates.lng", parseFloat(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Itinerary / Route Configuration */}
              {(collectionType === "itinerary" || collectionType === "internationalTrip" || collectionType === "route") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-dark/10 pt-6">
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Trip Duration Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration || ""}
                      onChange={(e) => handleChange("duration", e.target.value)}
                      placeholder="e.g. 7 Days / 6 Nights"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>

                  {collectionType === "route" && (
                    <div>
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                        Total Distance
                      </label>
                      <input
                        type="text"
                        value={formData.distance || ""}
                        onChange={(e) => handleChange("distance", e.target.value)}
                        placeholder="e.g. 450 km or 12 km Trek"
                        className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty || "Moderate"}
                      onChange={(e) => handleChange("difficulty", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark focus:outline-none"
                    >
                      {["Easy", "Moderate", "Challenging"].map((d) => (
                        <option key={d} value={d} className="bg-brand-white text-brand-dark">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(collectionType === "itinerary" || collectionType === "internationalTrip") && (
                    <>
                      {collectionType === "itinerary" && (
                        <div>
                          <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                            Budget Tier
                          </label>
                          <select
                            value={formData.budget || "Mid-Range"}
                            onChange={(e) => handleChange("budget", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark focus:outline-none"
                          >
                            {["Budget-Friendly", "Mid-Range", "Premium", "Luxury"].map((b) => (
                              <option key={b} value={b} className="bg-brand-white text-brand-dark">
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                          Starting Price (₹ INR)
                        </label>
                        <input
                          type="number"
                          value={formData.priceFrom || ""}
                          onChange={(e) => handleChange("priceFrom", parseInt(e.target.value))}
                          placeholder="e.g. 24500"
                          className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Event specific fields */}
              {collectionType === "event" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-dark/10 pt-6">
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Event Month(s)
                    </label>
                    <input
                      type="text"
                      value={formData.month || ""}
                      onChange={(e) => handleChange("month", e.target.value)}
                      placeholder="e.g. November / December"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="e.g. Hampi, Karnataka"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Story / Blog Post Specific Fields */}
              {collectionType === "story" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-dark/10 pt-6">
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category || ""}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark focus:outline-none"
                    >
                      {["Spiritual", "Heritage", "Nature", "Food & Culture", "Adventure", "Festivals"].map((cat) => (
                        <option key={cat} value={cat} className="bg-brand-white text-brand-dark">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime || ""}
                      onChange={(e) => handleChange("readTime", e.target.value)}
                      placeholder="e.g. 5 min read"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author || ""}
                      onChange={(e) => handleChange("author", e.target.value)}
                      placeholder="e.g. Shadin Thappi"
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                      Publish Date/Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""}
                      onChange={(e) => handleChange("publishedAt", new Date(e.target.value).toISOString())}
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Generic text description */}
              <div>
                <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                  Intro pitch / Overview Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Provide an overview description context..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                />
              </div>

              {/* Experience relations (linking Destinations) */}
              {collectionType === "experience" && (
                <div className="border-t border-brand-dark/10 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">
                      Link Destinations & Details
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentList = formData.relatedDestinations || [];
                        handleChange("relatedDestinations", [...currentList, { _type: "reference", _ref: "" }]);
                      }}
                      className="text-[10px] text-brand-blue font-extrabold uppercase flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Destination
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData.relatedDestinations || []).map((rel: any, index: number) => (
                      <div key={index} className="flex gap-2 items-center bg-brand-offwhite/30 p-3 rounded-xl border border-brand-dark/10 relative">
                        <div className="flex-1">
                          <label className="block text-[9px] font-black text-brand-dark/60 uppercase mb-1">Destination #{index + 1}</label>
                          <select
                            value={rel._ref || ""}
                            onChange={(e) => {
                              const newList = [...(formData.relatedDestinations || [])];
                              newList[index] = { _type: "reference", _ref: e.target.value };
                              handleChange("relatedDestinations", newList);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-brand-white text-xs text-brand-dark focus:outline-none"
                          >
                            <option value="" className="bg-brand-white text-brand-dark/50">
                              -- Select Destination --
                            </option>
                            {destinations.map((d) => (
                              <option key={d._id} value={d._id} className="bg-brand-white text-brand-dark">
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newList = [...(formData.relatedDestinations || [])];
                            newList.splice(index, 1);
                            handleChange("relatedDestinations", newList);
                          }}
                          className="text-brand-dark/50 hover:text-red-600 text-xs px-2 font-bold mt-4"
                          title="Remove Relation"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {(formData.relatedDestinations || []).length === 0 && (
                    <p className="text-[10px] text-brand-dark/50 italic">No destinations linked to this experience yet.</p>
                  )}
                </div>
              )}

              {/* Status / Publish Controls */}
              <div className="border-t border-brand-dark/10 pt-6 flex flex-wrap gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isPublished || false}
                    onChange={(e) => handleChange("isPublished", e.target.checked)}
                    className="w-4 h-4 rounded border-brand-dark/20 bg-brand-offwhite text-brand-blue focus:ring-0 focus:ring-offset-0"
                  />
                  <div>
                    <span className="block text-xs font-black text-brand-dark group-hover:text-brand-blue transition-colors">
                      Live on Website (Published)
                    </span>
                    <span className="block text-[10px] text-brand-dark/60">
                      When ticked, this will instantly display in queries
                    </span>
                  </div>
                </label>

                {"isFeatured" in formData || collectionType === "destination" || collectionType === "itinerary" ? (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => handleChange("isFeatured", e.target.checked)}
                      className="w-4 h-4 rounded border-brand-dark/20 bg-brand-offwhite text-brand-blue focus:ring-0 focus:ring-offset-0"
                    />
                    <div>
                      <span className="block text-xs font-black text-brand-dark group-hover:text-brand-blue transition-colors">
                        Highlight as Featured
                      </span>
                      <span className="block text-[10px] text-brand-dark/60">
                        Display in recommended list or homepage carousels
                      </span>
                    </div>
                  </label>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED DAY-BY-DAY PLAN (FOR ITINERARIES AND DESTINATIONS) */}
          {activeTab === "itinerary-plan" && (collectionType === "itinerary" || collectionType === "internationalTrip" || collectionType === "destination") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-brand-dark uppercase">Visual Itinerary Designer</h3>
                  <p className="text-[10px] text-brand-dark/60 mt-1">
                    Manage stopping points chronologically. They will compile to PortableText.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDays((prev) => [
                      ...prev,
                      { title: `Day ${prev.length + 1}: Title`, description: "Describe today's activities..." },
                    ]);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-brand-blue/20 bg-brand-blue/10 text-[10px] font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add New Day
                </button>
              </div>

              {/* Days List */}
              <div className="space-y-4">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-brand-dark/10 bg-brand-offwhite/30 space-y-4 relative group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-[10px] font-extrabold text-brand-blue font-mono">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={day.title}
                          onChange={(e) => {
                            const newDays = [...days];
                            newDays[index].title = e.target.value;
                            setDays(newDays);
                          }}
                          placeholder="e.g. Day 1: Arrival & Local Exploration"
                          className="px-3 py-1.5 bg-brand-offwhite/50 border border-brand-dark/15 rounded-lg text-xs font-bold text-brand-dark w-80 focus:outline-none focus:ring-1 focus:ring-brand-blue/50"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (days.length === 1) return;
                          const newDays = [...days];
                          newDays.splice(index, 1);
                          setDays(newDays);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-xs text-brand-dark/60 hover:text-red-600 transition-all font-bold flex items-center gap-1"
                        title="Remove Day"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={day.description}
                      onChange={(e) => {
                        const newDays = [...days];
                        newDays[index].description = e.target.value;
                        setDays(newDays);
                      }}
                      placeholder="List daily adventures, stops, hotel details, and logistics. Double Enter creates new paragraphs."
                      className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLE BODY (FOR STORIES) */}
          {activeTab === "story-body" && collectionType === "story" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-brand-dark uppercase">Write Your Travel Story</h3>
                <p className="text-[10px] text-brand-dark/60 mt-1">
                  You can write structured HTML/Markdown here. Use `## Header` for sub-sections.
                </p>
              </div>

              <textarea
                rows={16}
                required
                value={markdownBody}
                onChange={(e) => setMarkdownBody(e.target.value)}
                placeholder="Write the full narrative of the journey. Double Enter creates paragraphs. E.g.\n\n## Walking through Hampi Ruins\n\nHampi is a paradise..."
                className="w-full px-4 py-4 rounded-2xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none font-sans leading-relaxed"
              />
            </div>
          )}

          {/* TAB 3: MEDIA & DESIGN (ALL COLLECTION TYPES) */}
          {activeTab === "media-design" && (
            <div className="space-y-6">
              {/* Cover/Main Image Input */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-brand-dark uppercase">Cover / Primary Image</h3>
                  <p className="text-[10px] text-brand-dark/60 mt-1">
                    Paste any direct image URL (Unsplash, local asset) or click "Upload Local Image" below (Recommended: 1200x675px or 16:9 landscape).
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={
                        typeof (formData.mainImage || formData.coverImage) === 'object'
                          ? (formData.mainImage?.asset?._ref || formData.coverImage?.asset?._ref || "")
                          : (formData.mainImage || formData.coverImage || "")
                      }
                      onChange={(e) => {
                        const field = "mainImage" in formData || collectionType === "destination" || collectionType === "experience" ? "mainImage" : "coverImage";
                        handleChange(field, e.target.value);
                      }}
                      placeholder="Paste image URL (https://...) or upload a file below"
                      className="flex-1 px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none font-mono"
                    />
                    {(formData.mainImage || formData.coverImage) && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-dark/10 shrink-0 bg-brand-offwhite flex items-center justify-center relative">
                        {/* Preview Image */}
                        <img
                          src={
                            typeof (formData.mainImage || formData.coverImage) === 'string'
                              ? (formData.mainImage || formData.coverImage)
                              : `https://cdn.sanity.io/images/${projectId}/${dataset}/${(formData.mainImage?.asset?._ref || formData.coverImage?.asset?._ref || "").replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`
                          }
                          alt="Preview"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as any).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-xs font-bold rounded-xl cursor-pointer transition-colors border border-brand-blue/20 select-none flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Upload Local Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const uploadFormData = new FormData();
                          uploadFormData.append("file", file);

                          const field = "mainImage" in formData || collectionType === "destination" || collectionType === "experience" ? "mainImage" : "coverImage";

                          handleChange(field, "Uploading file...");

                          try {
                            const res = await fetch("/api/admin/upload", {
                              method: "POST",
                              body: uploadFormData,
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              handleChange(field, data.sanityRef);
                            } else {
                              alert(`Upload failed: ${data.message || data.error}`);
                              handleChange(field, "");
                            }
                          } catch (err) {
                            alert("Error uploading image");
                            handleChange(field, "");
                          }
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-brand-dark/60 font-semibold">
                      {typeof (formData.mainImage || formData.coverImage) === 'object'
                        ? "Uploaded to Sanity Asset Store ✓"
                        : (formData.mainImage || formData.coverImage) === "Uploading file..."
                          ? "Uploading image..."
                          : "No file chosen (Supports JPG, PNG, WebP)"}
                    </span>
                  </div>
                </div>

                {/* Preset Travel Image Picker */}
                <div className="space-y-2 border-t border-brand-dark/10 pt-4">
                  <span className="block text-[10px] font-black text-brand-dark/60 uppercase tracking-widest">
                    Quick Preset Pixels
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => {
                          const field = "mainImage" in formData || collectionType === "destination" || collectionType === "experience" ? "mainImage" : "coverImage";
                          handleChange(field, img.url);
                        }}
                        className="h-20 rounded-xl overflow-hidden border border-brand-dark/10 hover:border-brand-blue/50 relative group transition-all text-left"
                      >
                        <img src={img.url} alt={img.name} className="object-cover w-full h-full absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 p-2 flex items-end">
                          <span className="text-[9px] font-bold text-white truncate leading-none">
                            {img.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Things To Do Array (Destinations Only) */}
              {collectionType === "destination" && (
                <div className="space-y-4 border-t border-brand-dark/10 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-brand-dark uppercase">Things To Do</h3>
                      <p className="text-[10px] text-brand-dark/60 mt-1">Add activities and photos for this destination (Required: 800x600px or 4:3 landscape).</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleThingToDoAdd}
                      className="text-[10px] text-brand-blue font-extrabold uppercase bg-brand-blue/10 px-3 py-2 rounded-xl hover:bg-brand-blue/20 transition-colors"
                    >
                      ✚ Add Activity
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(formData.thingsToDo || []).map((thing: any, index: number) => (
                      <div key={index} className="flex flex-col gap-3 p-4 rounded-xl border border-brand-dark/10 bg-brand-offwhite/30 relative">
                        <button
                          type="button"
                          onClick={() => handleThingToDoRemove(index)}
                          className="absolute top-4 right-4 text-brand-dark/50 hover:text-red-600 text-xs font-bold"
                        >
                          ✕ Remove
                        </button>
                        <div>
                          <label className="block text-[10px] font-black text-brand-dark uppercase tracking-wider mb-1">Activity Title *</label>
                          <input
                            type="text"
                            required
                            value={thing.title || ""}
                            onChange={(e) => handleThingToDoChange(index, "title", e.target.value)}
                            placeholder="e.g. Guided Heritage Walk"
                            className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-brand-white text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-brand-dark uppercase tracking-wider mb-1">Photo URL / Upload</label>
                          <div className="flex gap-3 items-center">
                            <input
                              type="text"
                              value={typeof thing.image === 'object' ? (thing.image?.asset?._ref || "") : (thing.image || "")}
                              onChange={(e) => handleThingToDoChange(index, "image", e.target.value)}
                              placeholder="Paste URL or upload"
                              className="flex-1 px-3 py-2 rounded-lg border border-brand-dark/15 bg-brand-white text-xs text-brand-dark placeholder-brand-dark/45 font-medium focus:outline-none font-mono"
                            />
                            <label className="px-3 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap border border-brand-blue/20">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const uploadFormData = new FormData();
                                  uploadFormData.append("file", file);
                                  handleThingToDoChange(index, "image", "Uploading...");
                                  try {
                                    const res = await fetch("/api/admin/upload", { method: "POST", body: uploadFormData });
                                    const data = await res.json();
                                    if (res.ok && data.success) handleThingToDoChange(index, "image", data.sanityRef);
                                    else { alert("Upload failed"); handleThingToDoChange(index, "image", ""); }
                                  } catch (err) {
                                    alert("Error uploading image");
                                    handleThingToDoChange(index, "image", "");
                                  }
                                }}
                              />
                            </label>
                            {thing.image && thing.image !== "Uploading..." && (
                              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-brand-dark/10">
                                <img
                                  src={typeof thing.image === 'string' ? thing.image : `https://cdn.sanity.io/images/${projectId}/${dataset}/${(thing.image?.asset?._ref || "").replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as any).style.display = "none"; }}
                                  alt="Preview"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Theme Branding Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-dark/10 pt-6">
                <div>
                  <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">
                    Accent Theme Branding Color (Hex)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.themeColor || "#E67E22"}
                      onChange={(e) => handleChange("themeColor", e.target.value)}
                      className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-xl"
                    />
                    <input
                      type="text"
                      value={formData.themeColor || "#E67E22"}
                      onChange={(e) => handleChange("themeColor", e.target.value)}
                      placeholder="#e67e22"
                      className="flex-1 px-4 py-2 bg-brand-offwhite/50 border border-brand-dark/15 rounded-xl text-xs text-brand-dark font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Tags Inputs (For Stops, Highlights, Tips) */}
              {("highlights" in formData || "stops" in formData || "tips" in formData) && (
                <div className="grid grid-cols-1 gap-6 border-t border-brand-dark/10 pt-6">
                  {"highlights" in formData && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">
                          Key Trip Highlights (Tags list)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleArrayAdd("highlights")}
                          className="text-[10px] text-brand-blue font-extrabold uppercase"
                        >
                          ✚ Add highlight
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(formData.highlights || []).map((highlight: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => handleArrayChange("highlights", index, e.target.value)}
                              placeholder="e.g. Overnight Camping, Guided Walks"
                              className="flex-1 px-3 py-2 bg-brand-offwhite/50 border border-brand-dark/15 rounded-lg text-xs text-brand-dark"
                            />
                            <button
                              type="button"
                              onClick={() => handleArrayRemove("highlights", index)}
                              className="text-brand-dark/50 hover:text-red-600 text-xs px-2 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {collectionType === "route" && "stops" in formData && (
                    <div className="space-y-3 border-t border-brand-dark/10 pt-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">
                          Scenic Stops / Waypoints (Strings list)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleArrayAdd("stops")}
                          className="text-[10px] text-brand-blue font-extrabold uppercase"
                        >
                          ✚ Add Stop
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(formData.stops || []).map((stop: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={stop}
                              onChange={(e) => handleArrayChange("stops", index, e.target.value)}
                              placeholder="e.g. Ooty, Mysore"
                              className="flex-1 px-3 py-2 bg-brand-offwhite/50 border border-brand-dark/15 rounded-lg text-xs text-brand-dark"
                            />
                            <button
                              type="button"
                              onClick={() => handleArrayRemove("stops", index)}
                              className="text-brand-dark/50 hover:text-red-600 text-xs px-2 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action controls footer */}
        <div className="flex items-center justify-end gap-4 p-4 border border-brand-dark/10 bg-brand-white rounded-2xl">
          <button
            type="button"
            onClick={() => router.push(`/admin/${collectionType}s`)}
            className="px-6 py-3 rounded-xl border border-brand-dark/20 hover:border-brand-dark/30 bg-brand-offwhite text-xs font-bold text-brand-dark transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm disabled:opacity-50 transition-all"
          >
            {isSaving ? "Uploading to Sanity Database..." : `Publish / Save ${singularLabel}`}
          </button>
        </div>
      </form>
    </div>
  );
}
