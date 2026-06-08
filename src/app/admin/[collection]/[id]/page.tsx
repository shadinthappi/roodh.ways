"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DocumentForm from "../../components/DocumentForm";

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

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();

  const collectionKey = params.collection as string;
  const documentId = params.id as string;

  const config = COLLECTION_MAPPING[collectionKey];

  if (!config) {
    router.push("/admin");
    return null;
  }

  return (
    <div className="py-2">
      <DocumentForm
        collectionType={config.type}
        documentId={documentId}
        singularLabel={config.singular}
      />
    </div>
  );
}
