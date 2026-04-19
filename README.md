# Cloudflare Worker: Token Icon API

A Cloudflare Worker that returns token/chain icons given a chain ID and contract address or symbol.

## Parameters

| Param | Required | Description |
|-------|----------|-------------|
| `chainId` | yes | EVM chain ID (e.g. `1`, `8453`) |
| `address` | no* | Token contract address, or `0` for native token |
| `symbol` | no* | Token symbol (e.g. `USDC`) |
| `png` | no | Set to `true` to convert SVG icons to PNG |
| `bust` | no | Set to `true` to bypass cache and re-fetch |

*At least one of `address` or `symbol` is required.

## Fallback Chain

**Address only** — `address=0x...`
1. web3icons (by address)
2. TrustWallet (by address)

**Symbol only** — `symbol=USDC`
1. Alexandria (by symbol)
2. web3icons (by symbol)

**Both** — `address=0x...&symbol=USDC`
1. web3icons (by address)
2. TrustWallet (by address)
3. Alexandria (by symbol)
4. web3icons (by symbol)

**Native token** — `address=0`
1. TrustWallet chain logo
2. Alexandria chain SVG

## Usage

```
GET /?chainId=1&address=0x6B175474E89094C44Da98b954EedeAC495271d0F
GET /?chainId=1&symbol=USDC
GET /?chainId=1&address=0x6B175474E89094C44Da98b954EedeAC495271d0F&symbol=DAI
GET /?chainId=1&address=0&bust=true
GET /?chainId=1&symbol=USDC&png=true
```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/slwyts/web3-icons-api)
