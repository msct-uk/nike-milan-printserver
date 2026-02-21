import { readdir, stat, copyFile, unlink, rename } from "fs/promises";

import path from "path";
const config = useRuntimeConfig();

const queueDirPath = path.resolve(".", "public", "data", "queue");
const printedDirPath = path.resolve(".", "public", "data", "printed");
const archiveDirPath = path.resolve(".", "public", "data", "archived");

export default defineNitroPlugin((nitroApp) => {
  setInterval(async () => {
    try {
      const dirList = await readdir(queueDirPath);
      if (dirList.length > 0) {
        const sortList = await Promise.all(
          dirList.map(async (el) => {
            const fl = await stat(path.resolve(queueDirPath, el));
            return { file: el, mtimeMs: fl.mtimeMs };
          }),
        );
        sortList.sort((a, b) => a.mtimeMs - b.mtimeMs);
        const mostRecent = sortList[sortList.length - 1].file;

        await copyFile(
          path.resolve(queueDirPath, mostRecent),
          path.resolve(config.DNPPrintPath, mostRecent),
        );

        await copyFile(
          path.resolve(queueDirPath, mostRecent),
          path.resolve(printedDirPath, mostRecent),
        );
        await unlink(path.resolve(queueDirPath, mostRecent));
      } else {
        console.log("no files in source dir");
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const dirList = await readdir(printedDirPath);
      let sortList;
      if (dirList.length > 0) {
        sortList = await Promise.all(
          dirList.map(async (el) => {
            const fl = await stat(path.resolve(printedDirPath, el));
            return { file: el, mtimeMs: fl.mtimeMs };
          }),
        );
        sortList.forEach(async (el, i) => {
          const n = new Date().getTime() - 1000 * 60 * 60;

          if (el.mtimeMs <= n) {
            console.warn("file", el.file, "is older than a hour");
            console.error("A HOUR?");

            await rename(
              path.resolve(printedDirPath, el.file),
              path.resolve(archiveDirPath, el.file),
            );

            console.log("moved to archive directory");
            console.log("");
          }
        });
      } else {
        console.log("no files in printed dir (archive process)");
      }
    } catch (err) {
      console.log(err);
    }
  }, 5000);
});
