import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function POST() {
  try {
    await signOut({
      redirect: false,
      redirectTo: "/login",
    });

    return NextResponse.json({
      success: true,
      message: "خروج انجام شد.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "در خروج خطایی رخ داد.",
      },
      { status: 500 }
    );
  }
}
