const categories = ["asset", "system", "cutom", "erc20", "erc721"];

const networksContext = require.context("./networks", false, /\.json$/);
const projectAssetsInfo = {};

networksContext.keys().forEach((k) => {
  const c = networksContext(k);
  const source = k.split(".json")[0];
  projectAssetsInfo[source] = {};

  for (const category of categories) {
    projectAssetsInfo[source][category] = [];

    const assets = c?.[category] || [];
    for (const asset of assets) {
      if (asset.TokenID) {
        try {
          const logoPaths = asset.Logo.split("/");
          const imageName = logoPaths[logoPaths.length - 1];
          asset.logo = require(`./assets/images/${imageName}`);
        } catch {}
        projectAssetsInfo[source][category].push(asset);
      }
    }
  }
});

export { projectAssetsInfo };
