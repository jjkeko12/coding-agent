import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { folderStructure } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get("conversationId");
    const parentId = searchParams.get("parentId");

    const conditions: any[] = [];

    if (conversationId) {
      conditions.push(eq(folderStructure.conversationId, conversationId));
    }

    if (parentId) {
      conditions.push(eq(folderStructure.parentId, parentId));
    } else {
      conditions.push(isNull(folderStructure.parentId));
    }

    const folders = await db
      .select()
      .from(folderStructure)
      .where(and(...conditions));

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, name, path, parentId, isFile, fileType, content } = await request.json();

    if (!name || !path) {
      return NextResponse.json({ error: "name and path are required" }, { status: 400 });
    }

    const newFolder = await db
      .insert(folderStructure)
      .values({
        id: crypto.randomUUID(),
        conversationId: conversationId || null,
        name,
        path,
        parentId: parentId || null,
        isFile: isFile ?? false,
        fileType: fileType || null,
        content: content || null,
      })
      .returning();

    return NextResponse.json(newFolder[0], { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
