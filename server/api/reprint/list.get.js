// server/api/save-image.post.ts
import { readdir, stat } from "fs/promises";

import path from "path";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const printDirPath = path.resolve(".", "public", "data", "printed");

  const dirList = await readdir(printDirPath);

  const sortList = await Promise.all(
    dirList.map(async (el) => {
      const fl = await stat(path.resolve(printDirPath, el));
      return { file: el, mtimeMs: fl.mtimeMs };
    }),
  );
  sortList.sort((a, b) => b.mtimeMs - a.mtimeMs);

  return { list: sortList };
});
