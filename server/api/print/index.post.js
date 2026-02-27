// server/api/save-image.post.ts
import { writeFile } from "fs/promises";
import path from "path";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  console.log("got print request");
  const body = await readBody(event);

  if (!body.session || !body.image) {
    return { error: "Missing session or image in request body" };
  }

  // Sanitize session (UUID)
  const filename = `${body.session}.png`;

  // Remove base64 prefix if present
  const base64Data = body.image.replace(/^data:image\/png;base64,/, "");

  // Create the full path
  // const printPath = path.resolve(config.DNPPrintPath, filename);

  const savePath = path.resolve(".", "public", "data", "queue", filename);

  // console.log("print to", printPath, "save to", savePath);
  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Data, "base64");

  // Save the file
  // await writeFile(printPath, imageBuffer);

  await writeFile(savePath, imageBuffer);

  return { success: true };
});
