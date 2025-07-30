import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Note from "@/models/Notes";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const note = await Note.findOne({ _id: id });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "User not authorized to delete this note" },
        { status: 403 }
      );
    }

    await Note.deleteOne({ _id: id });

    return NextResponse.json(
      { success: true, message: "Note deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
} 