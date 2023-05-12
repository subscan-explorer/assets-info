# assets-info

This repo is convenient for assets owner to update some off-chain information such as website, twitter, etc. of asset displayed in [Subscan](https://darwinia.subscan.io/assets).

## How to update

1. Fork this repository
2. If there is no asset you want to update in the description file in the `./assets` directory, then create a new file first like `./assets/<any name>.json`, and the file format refers to [template.json](./assets/template.json) and [Description file](#description-file). Then update the information you need to update in the description file
3. If you need to update the logo, put your logo to `./logos/<network_category_symbol>.<svg/png>`
4. Finally, make a pull request to our repo, and replace placeholders of `Asset Owner & Signature Account`, `Signature Hash` or `Your Identity`
5. Done, now you can create and wait for the PR Checker to pass your request, and our team will double-check and confirm your request
6. After pr is merged, we will release new version (usually in one or two days), and asset info will be updated on Subscan.

> Some naming conventions about logo file:
>
> - File Extension: `png`/`svg` (Uppercase PNG/SVG is considered invalid)
> - File Name: `network_category_symbol.<png/svg>` (e.g. `Acala Mandala_asset_ABC.png`)
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
- `Network`: refers to [Network Identity](#networks)

## Networks

- `Acala`
- `Acala Mandala`
- `Aleph Zero`
- `Altair`
- `Astar`
- `Bajun`
- `Basilisk`
- `Bifrost`
- `Bifrost Kusama`
- `Bifrost Testnet`
- `Calamari`
- `Centrifuge`
- `Centrifuge Legacy`
- `ChainX`
- `Clover`
- `Clover Parachain`
- `Clover Testnet`
- `Composable`
- `Crab2`
- `Crust`
- `Crust Maxwell`
- `Crust Parachain`
- `Crust Shadow`
- `DALI`
- `Darwinia`
- `Darwinia Crab`
- `Darwinia2`
- `Datahighway Tanganika`
- `DeepBrain Chain`
- `Dock`
- `Dock PoA`
- `Dolphin`
- `Edgeware`
- `Efinity`
- `Encointer`
- `Equilibrium`
- `Genshiro`
- `Humanode`
- `HydraDX`
- `ICE Arctic`
- `IntegriTEE`
- `Interlay`
- `KILT Peregrine`
- `KILT Spiritnet`
- `Karura`
- `Karura-rococo`
- `Khala`
- `Kintsugi`
- `Kulupu`
- `Kusama`
- `Mangata`
- `Mangata Testnet`
- `Moonbase`
- `Moonbeam`
- `Moonriver`
- `Nodle`
- `OriginTrail Parachain`
- `OriginTrail Testnet`
- `Pangolin`
- `Pangolin Parachain`
- `Pangoro2`
- `Parallel`
- `Parallel Heiko`
- `Phala`
- `Picasso`
- `Pioneer`
- `Polkadex`
- `Polkadot`
- `Polymesh`
- `Polymesh Testnet`
- `Quartz`
- `Reef`
- `Robonomics`
- `Rockmine`
- `Rococo V1`
- `SNOW`
- `SORA`
- `Sakura`
- `Shibuya`
- `Shiden`
- `Stafi`
- `Statemine`
- `Statemint`
- `Subspace Gemini 3D`
- `Turing`
- `Unique`
- `Westend`
- `Zeitgeist`

## Why the Signature Checker report **Not-Verified**

1. Make sure you haven't changed other formats except for angle brackets(\<\>) and included words
2. Make sure the signature you put is made by the same Asset Owner/Admin
3. Make sure your description file is in valid JSON format
4. Probably our Signature checker give up its job :(

If up there is nothing to help, contact us, and we will help you manually verify your request.
