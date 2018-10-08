import { Summary } from "./types";

export default function addTotals(summary: Summary) {
  const chunkGroups = { ...summary.chunkGroups };
  let totalDiskSize = 0;
  let totalGzipSize = 0;

  for (const groupName in chunkGroups) {
    let diskSize = 0;
    let gzipSize = 0;

    const group = chunkGroups[groupName];
    const { assets } = group;
    for (const file in assets) {
      diskSize += assets[file].diskSize;
      if (assets[file].gzipSize) {
        gzipSize += assets[file].gzipSize!;
      }
      group.diskSize = diskSize;
      group.gzipSize = gzipSize;
    }
    totalDiskSize += group.diskSize || 0;
    totalGzipSize += group.gzipSize || 0;
  }

  return {
    ...summary,
    chunkGroups,
    diskSize: totalDiskSize,
    gzipSize: totalGzipSize
  };
}
