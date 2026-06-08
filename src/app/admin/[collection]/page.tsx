"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface DocumentItem {
  _id: string;
  _type: string;
  _updatedAt: string;
  title?: string;
  name?: string;
  slug?: { current: string } | string;
}

const COLLECTION_MAPPING: Record<string, { type: string; label: string; icon: string; singular: string }> = {
  destinations: { type: "destination", label: "Destinations", icon: "destinations", singular: "Destination" },
  experiences: { type: "experience", label: "Experiences", icon: "experiences", singular: "Experience" },
  routes: { type: "route", label: "Routes", icon: "routes", singular: "Route" },
  itineraries: { type: "itinerary", label: "Itineraries", icon: "itineraries", singular: "Itinerary" },
  internationalTrips: { type: "internationalTrip", label: "International Trips", icon: "internationalTrips", singular: "International Trip" },
  products: { type: "product", label: "Products", icon: "products", singular: "Product" },
  stories: { type: "story", label: "Stories", icon: "stories", singular: "Story" },
  events: { type: "event", label: "Events", icon: "events", singular: "Event" },
};

export default function CollectionList() {
  const params = useParams();
  const router = useRouter();
  const collectionKey = params.collection as string;
  const config = COLLECTION_MAPPING[collectionKey];

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocumentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!config) {
      router.push("/admin");
      return;
    }

    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/list?type=${config.type}`);
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
          setFilteredDocs(data);
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [collectionKey, config, router]);

  // Client-side search filtering
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredDocs(documents);
      return;
    }

    const filtered = documents.filter((doc) => {
      const title = (doc.title || doc.name || "").toLowerCase();
      const slugVal = typeof doc.slug === "object" ? doc.slug.current : doc.slug || "";
      return title.includes(term) || slugVal.toLowerCase().includes(term);
    });

    setFilteredDocs(filtered);
  }, [searchTerm, documents]);

  const getDocTitle = (doc: DocumentItem) => {
    return doc.title || doc.name || "Untitled Document";
  };

  const getSlug = (doc: DocumentItem) => {
    if (!doc.slug) return "not-set";
    return typeof doc.slug === "object" ? doc.slug.current : doc.slug;
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the ${config.singular} "${name}"? This action is permanent.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [{ delete: { id } }],
        }),
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d._id !== id));
      } else {
        const errorData = await res.json();
        alert(`Error deleting document: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Failed to communicate with Sanity API.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!config) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-brand-dark/70 font-bold">
            <span>Admin</span>
            <span>/</span>
            <span className="text-brand-dark/95 capitalize">{collectionKey}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-brand-blue shrink-0">
              {collectionKey === "destinations" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"></path></svg>}
              {collectionKey === "experiences" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"></path></svg>}
              {collectionKey === "routes" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zM9 3v15M15 6v15"></path></svg>}
              {collectionKey === "itineraries" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
              {collectionKey === "internationalTrips" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7 3.5 8.5l8.3 4.8-3.5 3.5-3.5-1L3 17.5 7 19.5l2 4 1.7-1.8-1-3.5 3.5-3.5 4.8 8.3 1.8-1.8z"></path></svg>}
              {collectionKey === "products" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"></path></svg>}
              {collectionKey === "stories" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>}
              {collectionKey === "events" && <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path></svg>}
            </span>
            <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">
              Manage {config.label}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-xs text-brand-blue font-bold border border-brand-blue/20">
              {documents.length}
            </span>
          </div>
        </div>

        <Link
          href={`/admin/${collectionKey}/new`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm active:scale-[0.98] transition-all self-start sm:self-center"
        >
          ✚ Add New {config.singular}
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex gap-4 p-4 rounded-2xl border border-brand-dark/10 bg-brand-white">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder={`Search by title, name, or slug in ${config.label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-dark/15 bg-brand-offwhite/50 text-xs text-brand-dark placeholder-brand-dark/45 focus:outline-none focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
          />
        </div>
      </div>

      {/* Listing Content */}
      {isLoading ? (
        <div className="h-64 border border-brand-dark/10 bg-brand-white rounded-3xl flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
          <p className="text-xs text-brand-dark/70 font-semibold">Querying database for {collectionKey}...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="h-64 border border-brand-dark/10 bg-brand-white rounded-3xl flex flex-col items-center justify-center text-center p-8 text-brand-dark/60 text-xs">
          <svg className="w-12 h-12 text-brand-dark/20 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
          <p className="mt-2 text-sm text-brand-dark font-extrabold uppercase">No records found</p>
          <p className="text-brand-dark/70 mt-1 max-w-xs">
            {searchTerm
              ? `We couldn't find any results matching "${searchTerm}". Try refinement.`
              : `You haven't added any ${collectionKey} to your database yet.`}
          </p>
          {!searchTerm && (
            <Link
              href={`/admin/${collectionKey}/new`}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Add Your First {config.singular}
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-brand-dark/10 bg-brand-white rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-dark/10 bg-brand-offwhite text-[10px] font-bold text-brand-dark/80 uppercase tracking-wider">
                  <th className="p-4 pl-6">Title / Name</th>
                  <th className="p-4">Slug / Reference Key</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-dark/10 text-xs text-brand-dark">
                {filteredDocs.map((doc) => {
                  const title = getDocTitle(doc);
                  const isDraft = doc._id.startsWith("drafts.");
                  const dateStr = new Date(doc._updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={doc._id}
                      className="hover:bg-brand-offwhite/50 transition-colors group"
                    >
                      <td className="p-4 pl-6 font-extrabold text-brand-dark group-hover:text-brand-blue transition-colors">
                        {title}
                      </td>
                      <td className="p-4 font-mono text-[10px] text-brand-dark/80">
                        {getSlug(doc)}
                      </td>
                      <td className="p-4">
                        {isDraft ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-[9px] font-bold uppercase text-amber-600 tracking-wide border border-amber-500/20">
                            ● Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold uppercase text-emerald-600 tracking-wide border border-emerald-500/20">
                            ● Published
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-brand-dark/70 font-semibold">
                        {dateStr}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2 shrink-0">
                        <Link
                          href={`/admin/${collectionKey}/${doc._id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-brand-dark/20 bg-brand-offwhite text-brand-dark/80 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-brand-blue/10 transition-all"
                          title="Edit Document"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(doc._id, title)}
                          disabled={isDeleting === doc._id}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-brand-dark/20 bg-brand-offwhite text-brand-dark/80 hover:text-red-600 hover:border-red-600/30 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete Document"
                        >
                          {isDeleting === doc._id ? (
                            <div className="w-4 h-4 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
