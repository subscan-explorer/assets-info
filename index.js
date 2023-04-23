const assetsContext = require.context("./assets", false, /\.json$/);
const networks = require("./networks.json");
const projectAssetsInfo = {};

assetsContext.keys().forEach((k) => {
  const c = assetsContext(k);
  if (!networks.includes(c.NetworkIdentity)) {
    return;
  }

  const source = c.NetworkIdentity;
  const category = c.Category;

  projectAssetsInfo[source] = projectAssetsInfo[source] || {};
  projectAssetsInfo[source][category] = projectAssetsInfo[source][category] || [];

  try {
    const logoPaths = c.Logo.split("/");
    const imageName = logoPaths[logoPaths.length - 1];
    c.Logo = require(`./logos/${imageName}`);
  } catch {}

  projectAssetsInfo[source][category].push(c);
});

export { projectAssetsInfo };
