const assetsContext = require.context("./assets", false, /\.json$/);
const networks = require("./networks.json");
const projectAssetsInfo = {};

assetsContext.keys().forEach((k) => {
  const c = assetsContext(k);
  if (!networks.includes(c.Network)) {
    if (c.Network) {
      return;
    }
    // token info in bulk
    c.forEach((p) => {
      const source = p.Network;
      const category = p.Category;
  
      projectAssetsInfo[source] = projectAssetsInfo[source] || {};
      projectAssetsInfo[source][category] = projectAssetsInfo[source][category] || [];
  
      try {
        if (p.Logo) {
          const fileName = p.Logo.split("/").slice(-1)[0];
          p.Logo = `https://gcs.subscan.io/assets-info/logos/${fileName}`;
        }
      } catch {}
  
      projectAssetsInfo[source][category].push(p);
    });
  } else {

    const source = c.Network;
    const category = c.Category;
  
    projectAssetsInfo[source] = projectAssetsInfo[source] || {};
    projectAssetsInfo[source][category] = projectAssetsInfo[source][category] || [];
  
    try {
      if (c.Logo) {
        const fileName = c.Logo.split("/").slice(-1)[0];
        c.Logo = `https://gcs.subscan.io/assets-info/logos/${fileName}`;
      }
    } catch {}
  
    projectAssetsInfo[source][category].push(c);
  }

});
module.exports = {
  projectAssetsInfo,
}
