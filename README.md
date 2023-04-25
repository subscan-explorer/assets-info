# assets-info

This repo is convenient for assets owner to update some off-chain information such as website, twitter, etc. of asset displayed in [Subscan](https://darwinia.subscan.io/assets).

## How to update

1. Fork this repository
2. If there is no asset you want to update in the description file in the `./assets` directory, then create a new file first like `./assets/<any name>.json`, and the file format refers to [template.json](./assets/template.json) and [Description file](#description-file). Then update the information you need to update in the description file
3. If you need to update the logo, put your logo to `./logos/<file name>.<svg/png>`
4. Finally, make a pull request to our repo, and replace placeholders of `Asset Owner & Signature Account`, `Signature Hash` or `Your Identity`
5. Done, now you can create and wait for the PR Checker to pass your request, and our team will double-check and confirm your request
6. After pr is merged, we will release new version (usually in one or two days), and asset info will be updated on Subscan.

## About the signature

In [Subscan](https://darwinia.subscan.io/assets), assets are currently divided into five categories: `asset`, `system`, `custom`, `erc20`, and `erc721`. If the asset category you update is `asset`, you need to sign your updated description file:

1. Copy the entire description file content
2. You can use [polkadot apps signing](https://polkadot.js.org/apps/#/signing) to sign. In the [polkadot apps signing](https://polkadot.js.org/apps/#/signing), use the owner or admin account of the asset to sign the file content
3. Then you can get the signed information.

## Asset categories

`asset`, `system`, `custom`, `erc20`, `erc721`

## Description file

> You can fill in " " for those that cannot be answered at present

- `TokenID`: asset/token id or contract address
- `TokenSymbol`: asset/token symbol
- `Logo`: asset/token logo
- `Description (en)`: description in English
- `Description (zh)`: description in Chinese
- `Website Link`: website link
- `Twitter Link`: twitter link
- `Telegram Link`: telegram link
- `Discord Link`: discord link
- `Medium Link`: medium link
- `Github Link`: github link
- `Category`: one of [Asset categories](#asset-categories)
- `NetworkIdentity`: refers to [Network Identity](#network-identity)

## Network Identity

| Name (displayed in the [Subscan](https://www.subscan.io/network_list)) | NetworkIdentity       |
| ---------------------------------------------------------------------- | --------------------- |
| Acala                                                                  | acala                 |
| Acala Mandala                                                          | acala-testnet         |
| Aleph Zero                                                             | alephzero             |
| Altair                                                                 | altair                |
| Astar                                                                  | astar                 |
| Bajun                                                                  | bajun                 |
| Basilisk                                                               | basilisk              |
| Bifrost                                                                | bifrost               |
| Bifrost Kusama                                                         | bifrost-kusama        |
| Bifrost Testnet                                                        | bifrost-testnet       |
| Calamari                                                               | calamari              |
| Centrifuge                                                             | centrifuge-parachain  |
| Centrifuge Legacy                                                      | centrifuge            |
| ChainX                                                                 | chainx                |
| Clover                                                                 | clover                |
| Clover Parachain                                                       | clv                   |
| Clover Testnet                                                         | clover-testnet        |
| Composable                                                             | composable            |
| Crab2                                                                  | crab-parachain        |
| Crust                                                                  | crust                 |
| Crust Maxwell                                                          | maxwell               |
| Crust Parachain                                                        | crust-parachain       |
| Crust Shadow                                                           | shadow                |
| DALI                                                                   | dali                  |
| Darwinia                                                               | darwinia              |
| Darwinia Crab                                                          | crab                  |
| Darwinia2                                                              | darwinia-parachain    |
| Datahighway Tanganika                                                  | datahighway-tanganika |
| DeepBrain Chain                                                        | dbc                   |
| Dock                                                                   | dock                  |
| Dock PoA                                                               | dock-poa              |
| Dolphin                                                                | dolphin               |
| Edgeware                                                               | edgeware              |
| Efinity                                                                | efinity               |
| Encointer                                                              | encointer             |
| Equilibrium                                                            | equilibrium           |
| Genshiro                                                               | genshiro              |
| Humanode                                                               | humanode              |
| HydraDX                                                                | hydradx               |
| ICE Arctic                                                             | arctic                |
| IntegriTEE                                                             | integritee            |
| Interlay                                                               | interlay              |
| KILT Peregrine                                                         | kilt                  |
| KILT Spiritnet                                                         | kilt-spiritnet        |
| Karura                                                                 | karura                |
| Karura-rococo                                                          | karura-rococo         |
| Khala                                                                  | khala                 |
| Kintsugi                                                               | kintsugi              |
| Kulupu                                                                 | kulupu                |
| Kusama                                                                 | kusama                |
| Mangata                                                                | mangatax              |
| Mangata Testnet                                                        | mangata-testnet       |
| Moonbase                                                               | moonbase              |
| Moonbeam                                                               | moonbeam              |
| Moonriver                                                              | moonriver             |
| Nodle                                                                  | nodle                 |
| OriginTrail Parachain                                                  | origintrail-parachain |
| OriginTrail Testnet                                                    | origintrail-testnet   |
| Pangolin                                                               | pangolin              |
| Pangolin Parachain                                                     | pangolin-parachain    |
| Pangoro2                                                               | pangoro               |
| Parallel                                                               | parallel              |
| Parallel Heiko                                                         | heiko                 |
| Phala                                                                  | phala                 |
| Picasso                                                                | picasso               |
| Pioneer                                                                | pioneer               |
| Polkadex                                                               | polkadex              |
| Polkadot                                                               | polkadot              |
| Polymesh                                                               | polymesh              |
| Polymesh Testnet                                                       | polymesh-testnet      |
| Quartz                                                                 | quartz                |
| Reef                                                                   | reef                  |
| Robonomics                                                             | robonomics            |
| Rockmine                                                               | rockmine              |
| Rococo V1                                                              | rococo                |
| SNOW                                                                   | snow                  |
| SORA                                                                   | sora                  |
| Sakura                                                                 | sakura                |
| Shibuya                                                                | shibuya               |
| Shiden                                                                 | shiden                |
| Stafi                                                                  | stafi                 |
| Statemine                                                              | statemine             |
| Statemint                                                              | statemint             |
| Subspace Gemini 3D                                                     | subspace              |
| Turing                                                                 | turing                |
| Unique                                                                 | unique                |
| Westend                                                                | westend               |
| Zeitgeist                                                              | zeitgeist             |

## Why the Signature Checker report **Not-Verified**

1. Make sure you haven't changed other formats except for angle brackets(\<\>) and included words
2. Make sure the signature you put is made by the same Asset Owner/Admin
3. Make sure your description file is in valid JSON format
4. Probably our Signature checker give up its job :(

If up there is nothing to help, contact us, and we will help you manually verify your request.
