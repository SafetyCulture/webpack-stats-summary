import table = require("markdown-table");

import { Summary } from "./types";

type Options = {
  includeChunks?: boolean;
  includeErrors?: boolean;
  includeWarnings?: boolean;
};

function newGroupRow(
  group: string,
  chunk: string,
  diskSize?: string | number,
  gzipSize?: string | number,
  includeChunks?: boolean
) {
  const row = [group];
  if (includeChunks) {
    row.push(chunk);
  }
  row.push.apply(row, [
    typeof diskSize === "string" ? diskSize : (diskSize! / 1000).toFixed(2),
    typeof gzipSize === "string" ? gzipSize : (gzipSize! / 1000).toFixed(2)
  ]);
  return row;
}

export default function chunkGroupsMarkDownTable(
  summary: Summary,
  options: Options = {}
) {
  const { includeChunks, includeErrors, includeWarnings } = options;
  const { chunkGroups } = summary;

  const rows = [
    newGroupRow("Chunk Group", "Chunk", "Disk KiB", "Gzip KiB", includeChunks),
    newGroupRow("Total", "", summary.diskSize, summary.gzipSize, includeChunks)
  ];

  let chunksBlock: boolean = false;
  for (const groupName in chunkGroups) {
    if (chunkGroups.hasOwnProperty(groupName)) {
      const group = chunkGroups[groupName];
      const { assets } = group;

      if (includeChunks && (chunksBlock || Object.keys(assets).length > 1)) {
        rows.push([]);
        chunksBlock = Object.keys(assets).length > 1;
      }

      rows.push(
        newGroupRow(
          groupName,
          "",
          group.diskSize,
          group.gzipSize,
          includeChunks
        )
      );

      if (includeChunks && Object.keys(assets).length > 1) {
        for (const file in assets) {
          if (assets.hasOwnProperty(file)) {
            rows.push(
              newGroupRow(
                "",
                file,
                assets[file].diskSize,
                assets[file].gzipSize || "",
                includeChunks
              )
            );
          }
        }
      }
    }
  }
  const align = ["", "r", "r"];
  if (includeChunks) {
    align.unshift("");
  }

  const tables = [table(rows, { align })];

  if (includeErrors && summary.errors.length) {
    tables.push(
      `### Errors\n\n${summary.errors
        .map(err => "```\n" + err + "\n```")
        .join("\n")}`
    );
  }

  if (includeWarnings && summary.warnings.length) {
    tables.push(
      `#### Warnings\n\n${summary.warnings
        .map(err => "```\n" + err + "\n```")
        .join("\n")}`
    );
  }

  return tables.join("\n\n");
}
