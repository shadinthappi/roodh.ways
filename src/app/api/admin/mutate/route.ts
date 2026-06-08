import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { revalidatePath } from "next/cache";

// Helper to download and upload image URLs to Sanity Asset Store
async function handleImageField(writeClient: any, value: any): Promise<any> {
  if (!value) return undefined;
  
  // If it's a string containing http/https, download and upload it as a Sanity Asset
  if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
    try {
      const response = await fetch(value);
      if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = value.split("/").pop()?.split("?")[0] || "image.jpg";
      
      const asset = await writeClient.assets.upload("image", buffer, { filename });
      return {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
    } catch (err) {
      console.error(`Failed to upload image from URL ${value}:`, err);
      return undefined;
    }
  }
  
  // If it's already a structured Sanity image asset reference, keep it
  if (typeof value === "object" && (value._type === "image" || (value.asset && value.asset._ref))) {
    return {
      _type: "image",
      asset: value.asset,
      alt: value.alt,
    };
  }
  
  return undefined;
}

export async function POST(request: Request) {
  // 1. Authentication check
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("roodhways_admin_authenticated")?.value === "true";

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch the write token
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!writeToken) {
    return NextResponse.json(
      {
        error: "Missing API Write Token",
        message: "Please configure SANITY_API_WRITE_TOKEN in your environment variables on Vercel or locally to enable mutations.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { mutations } = body;

    if (!mutations || !Array.isArray(mutations)) {
      return NextResponse.json({ error: "Invalid mutations payload" }, { status: 400 });
    }

    // Create custom write-enabled client
    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token: writeToken,
      useCdn: false,
    });

    const results = [];

    // Execute mutations sequentially
    for (const mutation of mutations) {
      if (mutation.createOrReplace) {
        const doc = { ...mutation.createOrReplace };

        // Process images dynamically!
        if (doc.mainImage) {
          doc.mainImage = await handleImageField(writeClient, doc.mainImage);
        }
        if (doc.coverImage) {
          doc.coverImage = await handleImageField(writeClient, doc.coverImage);
        }
        if (Array.isArray(doc.galleryImages)) {
          const uploadedGallery = [];
          for (const img of doc.galleryImages) {
            const uploaded = await handleImageField(writeClient, img);
            if (uploaded) uploadedGallery.push(uploaded);
          }
          doc.galleryImages = uploadedGallery;
        }
        if (Array.isArray(doc.thingsToDo)) {
          for (const thing of doc.thingsToDo) {
            if (thing.image) {
              thing.image = await handleImageField(writeClient, thing.image);
            }
          }
        }

        const res = await writeClient.createOrReplace(doc);
        results.push({ type: "createOrReplace", doc: res });
      } else if (mutation.create) {
        const doc = { ...mutation.create };
        const res = await writeClient.create(doc);
        results.push({ type: "create", doc: res });
      } else if (mutation.createIfNotExists) {
        const doc = { ...mutation.createIfNotExists };
        const res = await writeClient.createIfNotExists(doc);
        results.push({ type: "createIfNotExists", doc: res });
      } else if (mutation.patch) {
        const { id, set } = mutation.patch;
        const res = await writeClient.patch(id).set(set).commit();
        results.push({ type: "patch", doc: res });
      } else if (mutation.delete) {
        const { id } = mutation.delete;
        await writeClient.delete(id);
        results.push({ type: "delete", id });
      } else {
        return NextResponse.json({ error: "Unsupported mutation type" }, { status: 400 });
      }
    }

    // Revalidate the Next.js site cache to reflect changes instantly on public pages
    try {
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.warn("Failed to revalidate layout path cache:", revalErr);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Sanity Mutation API error:", error);
    return NextResponse.json(
      {
        error: "Database mutation failed",
        message: error.message || "An error occurred during database mutation.",
      },
      { status: 500 }
    );
  }
}
