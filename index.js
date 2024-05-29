const assetsContext = require.context("./assets", false, /\.json$/);
const networks = require("./networks.json");
const projectAssetsInfo = {};

assetsContext.keys().forEach((k) => {
  const c = assetsContext(k);
  if (!networks.includes(c.Network)) {
    return;
  }

  const source = c.Network;
  const category = c.Category;

  projectAssetsInfo[source] = projectAssetsInfo[source] || {};
  projectAssetsInfo[source][category] = projectAssetsInfo[source][category] || [];

  try {
    const fileName = c.Logo.split("/").slice(-1)[0];
    c.Logo = `https://gcs.subscan.io/assets-info/logos/${fileName}`;
  } catch {}

  projectAssetsInfo[source][category].push(c);
});
module.exports = {
  projectAssetsInfo,
}
