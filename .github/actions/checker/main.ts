const { getOctokit, context } = require("@actions/github");
const actions = require("@actions/core");

const { cryptoWaitReady, decodeAddress, signatureVerify } = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");
const nodeFetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

const categories: string[] = require("../../../categories.json");
const networks: string[] = require("../../../networks.json");
const headers = {
  "Content-Type": "application/json",
  "X-Api-Key": process.env.INPUT_APIKEY,
};

const getPRContentBySha = async (token: string, sha: string) => {
  const octKit = getOctokit(token);
  const result = await octKit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: sha,
  });

  const prs = result.data.filter((pr) => pr.state === "open");
  if (prs.length) {
    let pullRequest = prs[0];
    for (const pr of prs) {
      if (pr.head.sha.startsWith(sha)) {
        pullRequest = pr;
      }
    }
    return pullRequest;
  }

  return null;
};

const getPRContentByNumber = async (token: string, num: number) => {
  const octKit = getOctokit(token);
  const { data: pullRequest } = await octKit.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: num,
  });
  return pullRequest;
};

const isValidSignature = (signedMessage, signature, address) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);
  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

const tryIsValidSignatures = (signedMessages, signature, address) => {
  for (const signedMessage of signedMessages) {
    if (isValidSignature(signedMessage, signature, address)) {
      return true;
    }
  }
  return false;
};

const isValidAsset = async (id, symbol, network, owner, file) => {
  const apiUrl = `https://${network}.api.subscan.io/api/scan/assets/asset`;
  const body = JSON.stringify({ asset_id: id.toString() });

  const data = await nodeFetch(apiUrl, {
    method: "post",
    headers,
    body,
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data?.code === 0) {
        return data;
      }
      throw new Error(`response code ${data?.code} failed: ${data?.message}`);
    })
    .then((data) => data.data)
    .catch(console.error);

  if (data?.admin && data?.owner && data?.metadata) {
    if (owner !== data.owner?.address || owner !== data.admin.address) {
      actions.setFailed("wrong Asset Owner & Signature Account");
      return false;
    }
    if (symbol && symbol !== data.metadata?.symbol) {
      actions.setFailed(`wrong TokenSymbol in ${file}`);
      return false;
    }
    return true;
  }

  actions.setFailed("get asset failed");
  return false;
};

const isValidSystemCustom = async (symbol, category, network, file) => {
  const apiUrl = `https://${network}.api.subscan.io/api/v2/scan/tokens`;
  const body = JSON.stringify({
    include_extends: true,
    page: 0,
    provider: category === "system" ? "system" : "asset_registry",
    row: 100,
  });

  const tokens = await nodeFetch(apiUrl, {
    method: "post",
    headers,
    body,
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data?.code === 0) {
        return data;
      }
      throw new Error(`response code ${data?.code} failed: ${data?.message}`);
    })
    .then((data) => data.data.tokens)
    .catch(console.error);

  if (tokens?.length) {
    const found = tokens.filter((token) => token.symbol === symbol);
    if (found.length) {
      if (found.length > 1) {
        actions.warning(`found ${found.length} ${symbol} tokens`);
      }
      return true;
    }

    actions.setFailed(`TokenSymbol is invalid in ${file}`);
    return false;
  }

  actions.setFailed(`"get ${category} asset failed"`);
  return false;
};

const isValidERC20ERC721 = async (id, symbol, category, network, file) => {
  const apiUrl = `https://${network}.api.subscan.io/api/scan/evm/tokens`;
  const body = JSON.stringify({
    contracts: [id.toString()],
  });

  const list = await nodeFetch(apiUrl, {
    method: "post",
    headers,
    body,
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data?.code === 0) {
        return data;
      }
      throw new Error(`response code ${data?.code} failed: ${data?.message}`);
    })
    .then((data) => data.data?.list)
    .catch(console.error);

  if (list?.length) {
    if (symbol && symbol !== list[0].symbol) {
      actions.setFailed(`wrong TokenSymbol in ${file}`);
      return false;
    }
    return true;
  }

  actions.setFailed(`get ${category} asset failed`);
  return false;
};

const assetRegex =
  /Asset Owner & Signature Account:[\n\s]+`([a-zA-Z\d ]+)`[\n\s]+Data that needs to be signed:[\n\s]+`file`[\n\s]+Signature Hash: `([0xa-zA-Z\d ]+)`/;
const othersRegex = /Your Identity:[\n\s]+`(?:Team Member|Community Member|Other)`/;

const main = async () => {
  const changes: string[] = process.env.INPUT_CHANGED_FILES.split(" ");
  if (changes.length === 0) {
    console.log("changes not found");
    return;
  }

  const prSha = process.env.INPUT_SHA;
  const prNum = process.env.INPUT_NUM ? Number(process.env.INPUT_NUM) : 0;

  const prContent = prNum
    ? await getPRContentByNumber(process.env.INPUT_TOKEN, prNum)
    : await getPRContentBySha(process.env.INPUT_TOKEN, prSha);
  console.log("pr", `#${prNum}`, prSha);

  if (!prContent) {
    actions.setFailed("get PR content failed");
    return;
  }

  const extractedAsset = assetRegex.exec(prContent.body);
  const extractedOthers = othersRegex.exec(prContent.body);

  if (extractedAsset?.length !== 3 && extractedOthers?.length !== 1) {
    actions.setFailed("the PR content is not expected");
    return;
  }

  const owner = extractedAsset?.[1].trim();
  const signature = extractedAsset?.[2].trim();
  console.log("extracted", owner, signature);

  let verified = true;
  let logoVerified = true;

  await cryptoWaitReady();
  for (const file of changes) {
    if (!file.startsWith("assets/") || !file.endsWith(".json")) {
      continue;
    }

    const body: string = fs.readFileSync(__dirname + "/../../../" + file, "utf8").toString();
    if (body.length === 0) {
      continue;
    }
    const detail = JSON.parse(body);
    const {
      TokenID: tokenId,
      Category: category,
      Network: Network,
      Logo: logo,
    } = detail;
    let tokenSymbol = detail.TokenSymbol;

    if (!networks.includes(Network)) {
      actions.setFailed(`Network is invalid in ${file}`);
      verified = false;
    }
    if (!categories.includes(category)) {
      actions.setFailed(`Category is invalid in ${file}`);
      verified = false;
    }

    if (logo) {
      const extension = logo.split('.').slice(-1)[0];
      const logoPath = path.join(__dirname, "/../../", logo);
      const logoFileName = logo.split('/').slice(-1)[0].split('.')[0].split('_');

      if (!fs.existsSync(logoPath)) {
        actions.setFailed(`${logoPath} does not exists`);
        verified = false;
        logoVerified = false;
      } else if (extension !== 'png' && extension !== 'svg') {
        actions.setFailed(`Expect logo in png or svg format`);
        verified = false;
        logoVerified = false;
      } else if (fs.lstatSync(logoPath).size / 1024 > 30) {
        actions.setFailed(`The logo file should not be larger than 30KB`);
        verified = false;
        logoVerified = false;
      } else if (logoFileName.length !== 3 || logoFileName[0] !== Network || logoFileName[1] !== category || (tokenSymbol && logoFileName[2] !== tokenSymbol)) {
        actions.setFailed(`Please name the logo file according to the network_category_symbol.<png/svg> format`);
        verified = false;
        logoVerified = false;
      }

      if (!tokenSymbol && logoFileName.length === 3) {
        tokenSymbol = logoFileName[2];
      }
    }

    if (category === "asset") {
      if (!owner || !signature) {
        actions.setFailed("get owner or signature failed");
        verified = false;
        continue;
      }

      verified = !verified || (await isValidAsset(tokenId, tokenSymbol, Network, owner, file));

      const secondBody = body.replace(/\n/g, " ");
      const thirdBody = secondBody.trim();
      if (!tryIsValidSignatures([body, secondBody, thirdBody], signature, owner)) {
        actions.setFailed("The signature is invalid");
        verified = false;
      }
    } else if (category === "system" || category === "custom") {
      verified = !verified || (await isValidSystemCustom(tokenId || tokenSymbol, category, Network, file));
    } else if (category === "erc20" || category === "erc721") {
      verified = !verified || (await isValidERC20ERC721(tokenId, tokenSymbol, category, Network, file));
    }

    if (!verified) {
      break;
    }
  }

  actions.setOutput("logoVerified", logoVerified ? "true" : "false");
  actions.setOutput("verified", verified ? "true" : "false");
};

main().then();
