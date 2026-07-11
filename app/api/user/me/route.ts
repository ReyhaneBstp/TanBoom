import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "احراز هویت نشده‌اید.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: session.user,
  });
}
