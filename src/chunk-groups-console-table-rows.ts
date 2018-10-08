import { Summary } from "./types";

type Options = { includeChunks?: boolean };

export default function chunkGroupsTableRows(
  summary: Summary,
  options: Options = {}
) {
  const { includeChunks } = options;
  const { chunkGroups } = summary;

  const totalRow: any[] = ["Total"];
  if (includeChunks) {
    totalRow.push("");
  }
  totalRow.push.apply(totalRow, [
    {
      content: (summary.diskSize! / 1000).toFixed(2),
      hAlign: "right"
    },
    {
      content: (summary.gzipSize! / 1000).toFixed(2),
      hAlign: "right"
    }
  ]);

  const rows = [totalRow];
  let chunksBlock: boolean = false;

  for (const groupName in chunkGroups) {
    if (chunkGroups.hasOwnProperty(groupName)) {
      const group = chunkGroups[groupName];
      const { assets } = group;

      if (includeChunks && (chunksBlock || Object.keys(assets).length > 1)) {
        rows.push([]);
        chunksBlock = Object.keys(assets).length > 1;
      }

      const groupRow: any[] = [groupName];
      if (includeChunks) {
        groupRow.push("");
      }
      groupRow.push.apply(groupRow, [
        {
          content: (group.diskSize! / 1000).toFixed(2),
          hAlign: "right"
        },
        {
          content: (group.gzipSize! / 1000).toFixed(2),
          hAlign: "right"
        }
      ]);
      rows.push(groupRow);

      if (includeChunks && Object.keys(assets).length > 1) {
        for (const file in assets) {
          if (assets.hasOwnProperty(file)) {
            rows.push([
              "",
              file,
              {
                content: (assets[file].diskSize / 1000).toFixed(2),
                hAlign: "right"
              },
              {
                content: assets[file].gzipSize
                  ? (assets[file].gzipSize! / 1000).toFixed(2)
                  : "",
                hAlign: "right"
              }
            ]);
          }
        }
      }
    }
  }
  return rows;
}
