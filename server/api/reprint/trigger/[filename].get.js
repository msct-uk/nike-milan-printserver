// server/api/save-image.post.ts
import { readdir, stat, copyFile } from "fs/promises";

import path from "path";
const config = useRuntimeConfig();

const queueDirPath = path.resolve(".", "public", "data", "queue");
const printedDirPath = path.resolve(".", "public", "data", "printed");

export default defineEventHandler(async (event) => {
  const fileName = getRouterParam(event, "filename");

  await copyFile(
    path.resolve(printedDirPath, fileName),
    path.resolve(queueDirPath, fileName),
  );

  return { success: true };
});
