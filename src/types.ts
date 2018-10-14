export type Assets = {
  [file: string]: {
    diskSize: number;
    gzipSize?: number;
  };
};

export type ChunkGroup = {
  assets: Assets;
  diskSize?: number;
  gzipSize?: number;
};

export type ChunkGroups = {
  [group: string]: ChunkGroup;
};

export type Summary = {
  chunkGroups: ChunkGroups;
  diskSize?: number;
  gzipSize?: number;
  errors: string[];
  warnings: string[];
};
