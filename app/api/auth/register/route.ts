import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/server/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          fieldErrors: result.fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        user: result.user,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "در ثبت‌نام خطایی رخ داد.",
      },
      { status: 500 }
    );
  }
}
