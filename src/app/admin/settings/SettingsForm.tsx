"use client";

import React, { useState } from "react";
import { projectId, dataset } from "@/sanity/env";

const HERO_FIELDS = [
  { key: "internationalHero", label: "International Page Hero" },
  { key: "destinationsHero", label: "Destinations Page Hero" },
  { key: "experiencesHero", label: "Experiences Page Hero" },
  { key: "routesHero", label: "Routes Page Hero" },
  { key: "storiesHero", label: "Stories Page Hero" },
  { key: "eventsHero", label: "Events Page Hero" },
  { key: "visaHero", label: "E-Visa Page Hero" },
  { key: "travelTradeHero", label: "Travel Trade Page Hero" },
];

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState<any>(initialData || { _id: "siteSettings", _type: "siteSettings" });
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (file: File, fieldKey: string) => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    setFormData((prev: any) => ({ ...prev, [fieldKey]: "Uploading..." }));

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev: any) => ({ ...prev, [fieldKey]: data.sanityRef }));
      } else {
        alert(`Upload failed: ${data.message || data.error}`);
        setFormData((prev: any) => {
          const next = { ...prev };
          delete next[fieldKey];
          return next;
        });
      }
    } catch (err) {
      alert("Error uploading file.");
    }
  };

  const handleSocialFeedImageUpload = async (file: File, index: number) => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    setFormData((prev: any) => {
      const feed = [...(prev.socialFeedImages || [])];
      if (!feed[index]) feed[index] = { _key: Date.now().toString() };
      feed[index] = { ...feed[index], image: "Uploading..." };
      return { ...prev, socialFeedImages: feed };
    });

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev: any) => {
          const feed = [...(prev.socialFeedImages || [])];
          feed[index] = { ...feed[index], image: data.sanityRef };
          return { ...prev, socialFeedImages: feed };
        });
      } else {
        alert(`Upload failed: ${data.message || data.error}`);
        setFormData((prev: any) => {
          const feed = [...(prev.socialFeedImages || [])];
          delete feed[index].image;
          return { ...prev, socialFeedImages: feed };
        });
      }
    } catch (err) {
      alert("Error uploading file.");
    }
  };

  const getImageUrl = (imgRef: any) => {
    if (!imgRef || !imgRef.asset || !imgRef.asset._ref) return null;
    const ref = imgRef.asset._ref;
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const setFields: any = {};
      const fields = [
        "internationalHero",
        "destinationsHero",
        "experiencesHero",
        "routesHero",
        "storiesHero",
        "eventsHero",
        "visaHero",
        "travelTradeHero",
        "contactEmail",
        "instagramUrl",
        "facebookUrl",
        "twitterUrl",
        "youtubeUrl",
        "whatsappUrl",
        "socialFeedImages",
        "testimonials",
        "exploreWaysTitle",
        "exploreWaysSubtitle",
        "exploreWaysItems",
      ];
      fields.forEach((field) => {
        if (formData[field] !== undefined) {
          setFields[field] = formData[field];
        }
      });

      const payload = {
        mutations: [
          {
            createIfNotExists: {
              _id: "siteSettings",
              _type: "siteSettings",
            },
          },
          {
            patch: {
              id: "siteSettings",
              set: setFields,
            },
          },
        ],
      };

      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Settings saved successfully!");
      } else {
        alert(`Failed to save: ${data.message || data.error || "Unknown database error"}`);
      }
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-8">
        <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-2">Page Hero Backgrounds</h2>
        <p className="text-xs text-brand-dark/60 font-medium">Upload cinematic, high-quality images to be used as backgrounds for the main section headers on these pages (Recommended: 1920x1080px for 16:9 or 2560x1080px for 21:9 landscape).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {HERO_FIELDS.map((field) => {
          const isUploading = formData[field.key] === "Uploading...";
          const imgUrl = typeof formData[field.key] === "string" ? formData[field.key] : getImageUrl(formData[field.key]);

          return (
            <div key={field.key} className="flex flex-col gap-3">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">{field.label}</label>
              
              <div className="relative w-full h-40 rounded-xl bg-brand-offwhite border border-brand-dark/10 overflow-hidden group flex flex-col items-center justify-center text-center p-4">
                {imgUrl && imgUrl !== "Uploading..." ? (
                  <img src={imgUrl} alt={field.label} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-brand-dark/30 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-brand-dark/50 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-brand-white/20 border-t-brand-white animate-spin" />
                  </div>
                )}

                <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="px-4 py-2 bg-brand-white text-brand-dark text-xs font-bold rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0], field.key);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8 pt-8 border-t border-brand-dark/10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-2">Social Feed Images</h2>
            <p className="text-xs text-brand-dark/60 font-medium">Manage the 10 images that appear in the Bento grid on the homepage.</p>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                socialFeedImages: [...(prev.socialFeedImages || []), { _key: Date.now().toString(), tag: "", color: "bg-brand-blue" }]
              }));
            }}
            className="px-4 py-2 bg-brand-dark text-brand-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-brand-blue transition-colors"
          >
            + Add Image
          </button>
        </div>

        <div className="space-y-6">
          {(formData.socialFeedImages || []).map((item: any, idx: number) => {
            const isUploading = item.image === "Uploading...";
            const imgUrl = typeof item.image === "string" ? item.image : getImageUrl(item.image);

            return (
              <div key={item._key || idx} className="flex gap-6 p-4 border border-brand-dark/10 rounded-xl bg-brand-white/50 relative">
                {/* Remove Button */}
                <button 
                  type="button" 
                  onClick={() => {
                    if(confirm("Remove this image?")) {
                      setFormData((prev: any) => ({
                        ...prev,
                        socialFeedImages: prev.socialFeedImages.filter((_: any, i: number) => i !== idx)
                      }));
                    }
                  }}
                  className="absolute top-4 right-4 text-brand-dark/30 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                {/* Image Upload Area */}
                <div className="w-32 h-32 shrink-0 relative rounded-lg bg-brand-offwhite border border-brand-dark/10 overflow-hidden group flex flex-col items-center justify-center text-center">
                  {imgUrl && imgUrl !== "Uploading..." ? (
                    <img src={imgUrl} alt={item.tag} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-brand-dark/30 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-brand-dark/50 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border-2 border-brand-white/20 border-t-brand-white animate-spin" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-2 py-1 bg-brand-white text-brand-dark text-[10px] font-bold rounded cursor-pointer hover:scale-105 transition-transform shadow">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleSocialFeedImageUpload(e.target.files[0], idx);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-4 pt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Location Tag</label>
                    <input 
                      type="text" 
                      value={item.tag || ""}
                      onChange={(e) => {
                        setFormData((prev: any) => {
                          const feed = [...prev.socialFeedImages];
                          feed[idx] = { ...feed[idx], tag: e.target.value };
                          return { ...prev, socialFeedImages: feed };
                        });
                      }}
                      placeholder="e.g. Rajasthan"
                      className="w-full max-w-sm px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Fallback Color Class</label>
                    <input 
                      type="text" 
                      value={item.color || ""}
                      onChange={(e) => {
                        setFormData((prev: any) => {
                          const feed = [...prev.socialFeedImages];
                          feed[idx] = { ...feed[idx], color: e.target.value };
                          return { ...prev, socialFeedImages: feed };
                        });
                      }}
                      placeholder="e.g. bg-[#C0392B]"
                      className="w-full max-w-sm px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          {(!formData.socialFeedImages || formData.socialFeedImages.length === 0) && (
            <div className="p-8 text-center border border-dashed border-brand-dark/20 rounded-xl text-brand-dark/40 font-medium text-sm">
              No images added yet. Click "+ Add Image" to start building your grid.
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 pt-8 border-t border-brand-dark/10">
        <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-2">Explore Your Way</h2>
        <p className="text-xs text-brand-dark/60 font-medium mb-6">Manage the scrolling destination showcase section on the homepage.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Section Title</label>
            <input 
              type="text" 
              value={formData.exploreWaysTitle || ""}
              onChange={(e) => setFormData({...formData, exploreWaysTitle: e.target.value})}
              placeholder="e.g. Explore\nYour Way"
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Section Subtitle</label>
            <textarea 
              value={formData.exploreWaysSubtitle || ""}
              onChange={(e) => setFormData({...formData, exploreWaysSubtitle: e.target.value})}
              placeholder="e.g. From the soaring peaks..."
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue resize-none h-[46px]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Showcase Items</label>
          <button 
            type="button" 
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                exploreWaysItems: [...(prev.exploreWaysItems || []), { _key: Date.now().toString(), title: "", desc: "", color: "bg-brand-blue" }]
              }));
            }}
            className="px-4 py-2 bg-brand-dark text-brand-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-brand-blue transition-colors"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-4 mb-12">
          {(formData.exploreWaysItems || []).map((item: any, idx: number) => (
            <div key={item._key || idx} className="flex gap-4 p-4 border border-brand-dark/10 rounded-xl bg-brand-white/50 relative">
              <button 
                type="button" 
                onClick={() => {
                  if(confirm("Remove this item?")) {
                    setFormData((prev: any) => ({
                      ...prev,
                      exploreWaysItems: prev.exploreWaysItems.filter((_: any, i: number) => i !== idx)
                    }));
                  }
                }}
                className="absolute top-4 right-4 text-brand-dark/30 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Title</label>
                  <input type="text" value={item.title || ""} onChange={(e) => {
                      setFormData((prev: any) => {
                        const items = [...prev.exploreWaysItems];
                        items[idx] = { ...items[idx], title: e.target.value };
                        return { ...prev, exploreWaysItems: items };
                      });
                    }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Description</label>
                  <input type="text" value={item.desc || ""} onChange={(e) => {
                      setFormData((prev: any) => {
                        const items = [...prev.exploreWaysItems];
                        items[idx] = { ...items[idx], desc: e.target.value };
                        return { ...prev, exploreWaysItems: items };
                      });
                    }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Color Class</label>
                  <input type="text" value={item.color || ""} onChange={(e) => {
                      setFormData((prev: any) => {
                        const items = [...prev.exploreWaysItems];
                        items[idx] = { ...items[idx], color: e.target.value };
                        return { ...prev, exploreWaysItems: items };
                      });
                    }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs" />
                </div>
              </div>
            </div>
          ))}
          {(!formData.exploreWaysItems || formData.exploreWaysItems.length === 0) && (
            <div className="p-4 text-center border border-dashed border-brand-dark/20 rounded-xl text-brand-dark/40 font-medium text-xs">No items added.</div>
          )}
        </div>
      </div>

      <div className="mb-8 pt-8 border-t border-brand-dark/10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-2">Testimonials</h2>
            <p className="text-xs text-brand-dark/60 font-medium">Manage the traveler reviews shown on the homepage.</p>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setFormData((prev: any) => ({
                ...prev,
                testimonials: [...(prev.testimonials || []), { _key: Date.now().toString(), name: "", location: "", text: "", rating: 5 }]
              }));
            }}
            className="px-4 py-2 bg-brand-dark text-brand-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-brand-blue transition-colors"
          >
            + Add Testimonial
          </button>
        </div>

        <div className="space-y-4">
          {(formData.testimonials || []).map((item: any, idx: number) => (
            <div key={item._key || idx} className="flex flex-col gap-4 p-6 border border-brand-dark/10 rounded-xl bg-brand-white/50 relative">
              <button 
                type="button" 
                onClick={() => {
                  if(confirm("Remove this testimonial?")) {
                    setFormData((prev: any) => ({
                      ...prev,
                      testimonials: prev.testimonials.filter((_: any, i: number) => i !== idx)
                    }));
                  }
                }}
                className="absolute top-4 right-4 text-brand-dark/30 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Guest Name</label>
                  <input type="text" value={item.name || ""} onChange={(e) => {
                      setFormData((prev: any) => {
                        const t = [...prev.testimonials];
                        t[idx] = { ...t[idx], name: e.target.value };
                        return { ...prev, testimonials: t };
                      });
                    }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Location</label>
                  <input type="text" value={item.location || ""} onChange={(e) => {
                      setFormData((prev: any) => {
                        const t = [...prev.testimonials];
                        t[idx] = { ...t[idx], location: e.target.value };
                        return { ...prev, testimonials: t };
                      });
                    }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={item.rating || 5} onChange={(e) => {
                      setFormData((prev: any) => {
                        const t = [...prev.testimonials];
                        t[idx] = { ...t[idx], rating: Number(e.target.value) };
                        return { ...prev, testimonials: t };
                      });
                    }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs" />
                </div>
              </div>
              <div className="flex flex-col gap-1 pr-8">
                <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wide">Review Text</label>
                <textarea value={item.text || ""} onChange={(e) => {
                    setFormData((prev: any) => {
                      const t = [...prev.testimonials];
                      t[idx] = { ...t[idx], text: e.target.value };
                      return { ...prev, testimonials: t };
                    });
                  }} className="w-full px-3 py-2 rounded-lg border border-brand-dark/15 bg-white text-xs h-20 resize-none" />
              </div>
            </div>
          ))}
          {(!formData.testimonials || formData.testimonials.length === 0) && (
            <div className="p-4 text-center border border-dashed border-brand-dark/20 rounded-xl text-brand-dark/40 font-medium text-xs">No testimonials added.</div>
          )}
        </div>
      </div>

      <div className="mb-8 pt-8 border-t border-brand-dark/10">
        <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-2">Contact & Social Media</h2>
        <p className="text-xs text-brand-dark/60 font-medium mb-6">These details will be displayed in the site footer and contact sections.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Contact Email</label>
            <input 
              type="email" 
              value={formData.contactEmail || ""}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              placeholder="e.g. hello@roodh.ways.com"
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Instagram URL</label>
            <input 
              type="url" 
              value={formData.instagramUrl || ""}
              onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Facebook URL</label>
            <input 
              type="url" 
              value={formData.facebookUrl || ""}
              onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">Twitter / X URL</label>
            <input 
              type="url" 
              value={formData.twitterUrl || ""}
              onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})}
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">YouTube URL</label>
            <input 
              type="url" 
              value={formData.youtubeUrl || ""}
              onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wide">WhatsApp URL / Number</label>
            <input 
              type="text" 
              value={formData.whatsappUrl || ""}
              onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})}
              placeholder="https://wa.me/1234567890"
              className="w-full px-4 py-3 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-brand-dark/10 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm disabled:opacity-50 transition-all"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
