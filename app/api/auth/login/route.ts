import { NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { validateLoginInput } from "@/features/auth/server/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validateLoginInput(body);

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

    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });

    return NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          message: "ایمیل یا رمز عبور نادرست است.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "در ورود خطایی رخ داد.",
      },
      { status: 500 }
    );
  }
}
