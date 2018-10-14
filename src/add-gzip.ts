import * as fs from "fs";
import * as path from "path";

import * as getGzipSize from "gzip-size";

import { Summary } from "./types";

export default async function addGzip(summary: Summary, outputPath: string) {
  const chunkGroups = { ...summary.chunkGroups };
  for (const groupName in chunkGroups) {
    if (chunkGroups.hasOwnProperty(groupName)) {
      const group = chunkGroups[groupName];
      for (const file in group.assets) {
        if (group.assets.hasOwnProperty(file)) {
          const filePath = path.join(outputPath, file);
          if (/\.js$/.test(file) && fs.existsSync(filePath)) {
            group.assets = {
              ...group.assets,
              [file]: {
                ...group.assets[file],
                gzipSize: await getGzipSize.file(filePath)
              }
            };
          }
        }
      }
    }
  }
  return { ...summary, chunkGroups };
}
