import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Note from "@/models/Notes";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const notes = await Note.find({ userId: (session as { user: { id: string } }).user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notes });
  } catch {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 2000) {
    return NextResponse.json({ error: "Content cannot exceed 2000 characters" }, { status: 400 });
  }

  await dbConnect();

  try {
    const note = await Note.create({
      content: content.trim(),
      userId: (session as { user: { id: string } }).user.id,
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
} 