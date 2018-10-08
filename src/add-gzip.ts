import * as path from "path";

import * as getGzipSize from "gzip-size";

import { Summary } from "./types";

export default async function addGzip(summary: Summary, outputPath: string) {
  const chunkGroups = { ...summary.chunkGroups };
  for (const groupName in chunkGroups) {
    const group = chunkGroups[groupName];
    for (const file in group.assets) {
      if (/\.js$/.test(file)) {
        group.assets = {
          ...group.assets,
          [file]: {
            ...group.assets[file],
            gzipSize: await getGzipSize.file(path.join(outputPath, file))
          }
        };
      }
    }
  }
  return { ...summary, chunkGroups };
}
