import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

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
        message: "Please configure SANITY_API_WRITE_TOKEN in your environment variables to enable uploads.",
      },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create write client
    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token: writeToken,
      useCdn: false,
    });

    // Upload asset
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name || "upload.jpg",
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
      sanityRef: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
    });
  } catch (error: any) {
    console.error("Sanity asset upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error.message || "Failed to upload file to Sanity.",
      },
      { status: 500 }
    );
  }
}
