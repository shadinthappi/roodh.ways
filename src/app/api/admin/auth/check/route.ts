import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("roodhways_admin_authenticated")?.value === "true";

  if (isAuthenticated) {
    return NextResponse.json({ success: true, authenticated: true });
  }

  return NextResponse.json(
    { success: false, authenticated: false },
    { status: 401 }
  );
}
