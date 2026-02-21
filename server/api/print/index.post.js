// server/api/save-image.post.ts
import { writeFile } from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.session || !body.image) {
    return { error: "Missing session or image in request body" };
  }

  // Sanitize session (UUID)
  const filename = `${body.session}.png`;

  // Remove base64 prefix if present
  const base64Data = body.image.replace(/^data:image\/png;base64,/, "");

  // Create the full path
  const filePath = path.resolve(
    ".",
    "public",
    "data",
    "print",
    "Prints",
    "s4x6",
    filename,
  );

  const filePath2 = path.resolve(".", "public", "data", "printed", filename);

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Data, "base64");

  // Save the file
  await writeFile(filePath, imageBuffer);

  await writeFile(filePath2, imageBuffer);

  return { success: true, path: filePath };
});
