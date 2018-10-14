import { Summary } from "./types";

export default function addTotals(summary: Summary) {
  const chunkGroups = { ...summary.chunkGroups };

  for (const groupName in chunkGroups) {
    if (chunkGroups.hasOwnProperty(groupName)) {
      let diskSize = 0;
      let gzipSize = 0;

      const group = chunkGroups[groupName];
      const { assets } = group;
      for (const file in assets) {
        if (assets.hasOwnProperty(file)) {
          diskSize += assets[file].diskSize;
          if (assets[file].gzipSize) {
            gzipSize += assets[file].gzipSize!;
          }
          group.diskSize = diskSize;
          group.gzipSize = gzipSize;
        }
      }
    }
  }

  let totalDiskSize = 0;
  let totalGzipSize = 0;

  const chunks: {
    [file: string]: { diskSize: number; gzipSize?: number };
  } = {};

  for (const groupName in chunkGroups) {
    if (chunkGroups.hasOwnProperty(groupName)) {
      const group = chunkGroups[groupName];
      const { assets } = group;
      for (const file in assets) {
        if (assets.hasOwnProperty(file)) {
          chunks[file] = assets[file];
        }
      }
    }
  }
  for (const chunkName in chunks) {
    if (chunks.hasOwnProperty(chunkName)) {
      totalDiskSize += chunks[chunkName].diskSize || 0;
      totalGzipSize += chunks[chunkName].gzipSize || 0;
    }
  }

  return {
    ...summary,
    chunkGroups,
    diskSize: totalDiskSize,
    gzipSize: totalGzipSize
  };
}
