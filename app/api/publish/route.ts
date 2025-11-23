import { NextResponse } from "next/server";
import { z } from "zod";

import { InstagramApiError, publishImageToInstagram } from "@/lib/instagram";

const payloadSchema = z.object({
  imageUrl: z
    .string({ required_error: "Image URL is required" })
    .url("Provide a valid image URL accessible by Instagram"),
  caption: z
    .string({ required_error: "Caption is required" })
    .max(2200, "Caption must be 2,200 characters or fewer")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, caption } = payloadSchema.parse(body);

    const publishResult = await publishImageToInstagram({ imageUrl, caption });

    return NextResponse.json({
      ok: true,
      message: "Instagram post successfully published",
      details: publishResult
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.issues.map((issue) => issue.message).join("\n")
        },
        { status: 400 }
      );
    }

    if (error instanceof InstagramApiError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected server error"
      },
      { status: 500 }
    );
  }
}
