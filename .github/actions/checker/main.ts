const { getOctokit, context } = require("@actions/github");
const actions = require("@actions/core");

const { cryptoWaitReady, decodeAddress, signatureVerify } = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");
const nodeFetch = require("node-fetch");
const path = require('path');
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

const isValidAsset = async (id, symbol, network, owner) => {
  const apiUrl = `https://${network}.webapi.subscan.io/api/scan/assets/asset`;
  const body = { asset_id: id.toString() };

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
      actions.setFailed("wrong TokenSymbol");
      return false;
    }
    return true;
  }

  actions.setFailed("get asset failed");
  return false;
};

const isValidSystemCustom = async (symbol, category, network) => {
  const apiUrl = `https://${network}.webapi.subscan.io/api/v2/scan/tokens`;
  const body = {
    include_extends: true,
    page: 0,
    provider: category === "system" ? "system" : "asset_registry",
    row: 100,
  };

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
    if (tokens.some((token) => token.symbol === symbol)) {
      return true;
    }

    actions.setFailed("TokenSymbol is invalid");
    return false;
  }

  actions.setFailed(`"get ${category} asset failed"`);
  return false;
};

const isValidERC20ERC721 = async (id, symbol, category, network) => {
  const apiUrl = `https://${network}.webapi.subscan.io/api/scan/evm/tokens`;
  const body = {
    contracts: [id.toString()],
  };

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
      actions.setFailed("wrong TokenSymbol");
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
  console.log('changes', changes);

  const directoryPath = path.join(__dirname, '/../../../assets');
  console.log('directoryPath', directoryPath);
  const dir = fs.opendirSync(directoryPath);
  for await (const entry of dir) {
    console.log("Found file:", entry.name);
  }

  const template: string = fs.readFileSync(__dirname + "/../../../" + "assets/template.json", "utf8").toString();
  console.log('template', template);
  const erc20file: string = fs.readFileSync(__dirname + "/../../../" + "assets/crab-erc20-xRING.json", "utf8").toString();
  console.log('erc20file', erc20file);

  await cryptoWaitReady();
  for (const file of changes) {
    if (!file.startsWith("assets/") || !file.endsWith(".json")) {
      continue;
    }

    const p = __dirname + "/../../../" + file;
    console.log('path', p);

    const body: string = fs.readFileSync(__dirname + "/../../../" + file, "utf8").toString();
    console.log('body', body);
    if (body.length === 0) {
      continue;
    }
    const detail = JSON.parse(body);
    const { TokenID: tokenId, TokenSymbol: tokenSymbol, Category: category, NetworkIdentity: networkIdentity } = detail;

    if (!networks.includes(networkIdentity)) {
      actions.setFailed("NetworkIdentity is invalid");
      verified = false;
    }
    if (!categories.includes(category)) {
      actions.setFailed("Category is invalid");
      verified = false;
    }

    if (category === "asset") {
      if (!owner || !signature) {
        actions.setFailed("Get owner or signature failed");
        verified = false;
        continue;
      }

      verified = await isValidAsset(tokenId, tokenSymbol, networkIdentity, owner);

      const secondBody = body.replace(/\n/g, " ");
      const thirdBody = secondBody.trim();
      if (!tryIsValidSignatures([body, secondBody, thirdBody], signature, owner)) {
        actions.setFailed("The signature is invalid");
        verified = false;
      }
    } else if (category === "system" || category === "custom") {
      verified = await isValidSystemCustom(tokenSymbol, category, networkIdentity);
    } else {
      verified = await isValidERC20ERC721(tokenId, tokenSymbol, category, networkIdentity);
    }

    break;
  }

  actions.setOutput("verified", verified ? "true" : "false");
};

main().then();
