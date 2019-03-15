import { Assets, ChunkGroups, Summary } from "./types";

type StatsAsset = {
  name: string;
  size: number;
};

type StatsAssets = StatsAsset[];

type StatsAssetsLookup = {
  [key: string]: StatsAsset;
};

type Stats = {
  assets: StatsAssets;
  namedChunkGroups: {
    [groupName: string]: {
      assets: string[];
    };
  };
  outputPath: string;
  errors: string[];
  warnings: string[];
};

function getAssets(assetsStats: StatsAssets): Assets {
  const assets: Assets = {};
  for (const asset of assetsStats) {
    assets[asset.name] = {
      diskSize: asset.size
    };
  }
  return assets;
}

function getStatsAssetsLookup(stats: Stats) {
  const statsAssetsLookup: StatsAssetsLookup = {};
  stats.assets.forEach(asset => {
    statsAssetsLookup[asset.name] = asset;
  });
  return statsAssetsLookup;
}

function getGroupStatsAssets(stats: Stats, chunkGroup: string) {
  const statsAssetsLookup = getStatsAssetsLookup(stats);
  return stats.namedChunkGroups[chunkGroup].assets.map(
    asset => statsAssetsLookup[asset]
  ).filter(asset => !!asset); // Filter undefined assets
}

export default function getSummary(stats: Stats): Summary {
  const chunkGroupNames = Object.keys(stats.namedChunkGroups).sort();

  const chunkGroups: ChunkGroups = {};

  chunkGroups.main = {
    assets: getAssets(getGroupStatsAssets(stats, "main"))
  };

  for (const chunkGroup of chunkGroupNames) {
    // skip main chunk (already done)
    if (
      chunkGroup !== "main" &&
      stats.namedChunkGroups[chunkGroup].assets.length
    ) {
      const assetsSum = getAssets(getGroupStatsAssets(stats, chunkGroup));
      chunkGroups[chunkGroup] = { assets: assetsSum };
    }
  }
  const { errors, warnings } = stats;
  return { chunkGroups, errors, warnings };
}
