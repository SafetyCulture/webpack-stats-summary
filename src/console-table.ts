import * as Table from "cli-table2";

export default function consoleTable(options: any = {}) {
  const { includeChunks, ...tableOpts } = options;

  const opts = {
    bottom: "",
    chars: {
      bottom: "",
      "bottom-left": "",
      "bottom-mid": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      middle: " ",
      right: "",
      "right-mid": "",
      top: "",
      "top-left": "",
      "top-mid": "",
      "top-right": ""
    },
    head: [
      "Chunk Group",
      {
        content: "Disk KiB",
        hAlign: "center"
      },
      {
        content: "Gzip KiB",
        hAlign: "center"
      }
    ],
    style: { "padding-left": 0, "padding-right": 0 }
  };

  if (includeChunks) {
    opts.head = [
      "Chunk Group",
      "Chunk",
      {
        content: "Disk KiB",
        hAlign: "center"
      },
      {
        content: "Gzip KiB",
        hAlign: "center"
      }
    ];
  }

  return new Table({ ...opts, ...tableOpts });
}
