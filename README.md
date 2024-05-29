# assets-info

This repo is convenient for assets owner to update some off-chain information such as website, twitter, etc. of asset displayed in [Subscan](https://darwinia.subscan.io/assets).

## Changelog

### 1.1.0

Refactor: use gcp img instead of inline img to reduce package size

## How to update

1. Fork this repository
2. If there is no asset you want to update in the description file in the `./assets` directory, then create a new file first like `./assets/<any name>.json`, and the file format refers to [template.json](./assets/template.json) and [Description file](#description-file). Then update the information you need to update in the description file
3. If you need to update the logo, put your logo to `./logos/<network_category_symbol>.<svg/png>`, `network` is the domain part in hostname.
4. Finally, make a pull request to our repo, and replace placeholders of `Asset Owner & Signature Account`, `Signature Hash` or `Your Identity`
5. Done, now you can create and wait for the PR Checker to pass your request, and our team will double-check and confirm your request
6. After pr is merged, we will release new version (usually in one or two days), and asset info will be updated on Subscan.

> Some naming conventions about logo file:
>
> - File Extension: `png`/`svg` (Uppercase PNG/SVG is considered invalid)
> - File Name: `network_category_symbol.<png/svg>` (e.g. `acala-testnet_asset_ABC.png`)
> - Size: Less than `30KB`
> - Background: Preferably transparent

## About the signature

In [Subscan](https://darwinia.subscan.io/assets), assets are currently divided into five categories: `asset`, `system`, `custom`, `erc20`, and `erc721`. If the asset category you update is `asset`, you need to sign your updated description file:

1. Copy the entire description file content
2. You can use [polkadot apps signing](https://polkadot.js.org/apps/#/signing) to sign. In the [polkadot apps signing](https://polkadot.js.org/apps/#/signing), use the owner or admin account of the asset to sign the file content
3. Then you can get the signed information.

## Asset categories

`asset`, `system`, `custom`, `erc20`, `erc721`

## Description file

> You can fill in " " for those that cannot be answered at present. No insulting or disrespectful words.

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
- `Network`: refers to [Network Identity](#networks)

## Network Identity

Please note that the previous statemint/statemine/rockmine is now called assethub-polkadot/assethub-kusama/assethub-rococo.
eg: rockmine-asset-YAKIO.json -> assethub-rococo-asset-YAKIO.json

| Name (displayed in the [Subscan](https://www.subscan.io/network_list)) | Network               |
|------------------------------------------------------------------------|-----------------------|
| Acala                                                                  | acala                 |
| Acala Mandala                                                          | acala-testnet         |
| agung                                                                  | agung-testnet         |
| Ajuna                                                                  | ajuna                 |
| Aleph Zero                                                             | alephzero             |
| Aleph Zero Testnet                                                     | alephzero-testnet     |
| Altair                                                                 | altair                |
| Assethub Polkadot                                                      | assethub-polkadot     |
| Assethub Kusama                                                        | assethub-kusama       |
| Assethub Rococo                                                        | assethub-rococo       |
| Astar                                                                  | astar                 |
| Avail Testnet                                                          | avail-testnet         |
| Bajun                                                                  | bajun                 |
| Basilisk                                                               | basilisk              |
| Bifrost                                                                | bifrost               |
| Bifrost Kusama                                                         | bifrost-kusama        |
| Bridgehub Rococo                                                       | bridgehub-rococo      |
| Calamari                                                               | calamari              |
| Canary Matrix                                                          | canary-matrix         |
| Canary                                                                 | canary                |
| Centrifuge                                                             | centrifuge            |
| ChainX                                                                 | chainx                |
| Clover                                                                 | clover                |
| Composable                                                             | composable            |
| Continuum                                                              | continuum             |
| Coretime Kusama                                                        | coretime-kusama       |
| Coretime Rococo                                                        | coretime-rococo       |
| Coretime Westend                                                       | coretime-westend      |
| Crab                                                                   | crab                  |
| Creditcoin                                                             | creditcoin            |
| Creditcoin Testnet                                                     | creditcoin-testnet    |
| Creditcoin CC3 Testnet                                                 | creditcoin3-testnet   |
| Crust                                                                  | crust                 |
| Crust Maxwell                                                          | maxwell               |
| Crust Parachain                                                        | crust-parachain       |
| Crust Shadow                                                           | shadow                |
| Dancebox                                                               | dancebox              |
| Darwinia                                                               | darwinia              |
| DeepBrain Chain                                                        | dbc                   |
| Dock                                                                   | dock                  |
| Dolphin                                                                | dolphin               |
| Enjin Matrix                                                           | matrix                |
| Enjin                                                                  | enjin                 |
| Encointer                                                              | encointer             |
| Humanode                                                               | humanode              |
| HydraDX                                                                | hydradx               |
| IntegriTEE                                                             | integritee            |
| Interlay                                                               | interlay              |
| Joystream                                                              | joystream             |
| KILT Peregrine                                                         | kilt-testnet          |
| KILT Spiritnet                                                         | spiritnet             |
| Karura                                                                 | karura                |
| Khala                                                                  | khala                 |
| Kintsugi                                                               | kintsugi              |
| krest                                                                  | krest                 |
| Kusama                                                                 | kusama                |
| Mangata                                                                | mangatax              |
| Manta                                                                  | manta                 |
| Moonbase                                                               | moonbase              |
| Moonbeam                                                               | moonbeam              |
| Moonriver                                                              | moonriver             |
| NeuroWeb                                                               | neuroweb              |
| NeuroWeb Testnet                                                       | neuroweb-testnet      |
| Nodle                                                                  | nodle                 |
| Opal                                                                   | opal                  |
| Pangolin                                                               | pangolin              |
| Parallel                                                               | parallel              |
| Parallel Heiko                                                         | parallel-heiko        |
| Paseo                                                                  | paseo                 |
| Phala                                                                  | phala                 |
| Picasso                                                                | picasso               |
| Picasso Rococo                                                         | picasso-rococo        |
| Pioneer                                                                | pioneer               |
| Polkadex                                                               | polkadex              |
| Polkadex Parachain                                                     | polkadex-parachain    |
| Polkadot                                                               | polkadot              |
| Polymesh                                                               | polymesh              |
| Polymesh Testnet                                                       | polymesh-testnet      |
| Quartz                                                                 | quartz                |
| Robonomics                                                             | robonomics            |
| Rococo V1                                                              | rococo                |
| Shibuya                                                                | shibuya               |
| Shiden                                                                 | shiden                |
| SORA                                                                   | sora                  |
| Stafi                                                                   | stafi                  |
| Subspace Gemini 3F                                                     | subspace              |
| Turing                                                                 | turing                |
| Unique                                                                 | unique                |
| Vara                                                                   | vara                  |
| Westend                                                                | westend               |
| Zeitgeist                                                              | zeitgeist             |

## Why the Signature Checker report **Not-Verified**

1. Make sure you haven't changed other formats except for angle brackets(\<\>) and included words
2. Make sure the signature you put is made by the same Asset Owner/Admin
3. Make sure your description file is in valid JSON format
4. Probably our Signature checker give up its job :(

If up there is nothing to help, contact us, and we will help you manually verify your request.
