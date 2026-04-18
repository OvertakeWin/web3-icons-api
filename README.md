# Cloudflare Worker: Token Icon API

This project is a Cloudflare Worker that exposes an API endpoint. The endpoint accepts a chain ID and a contract address as parameters and returns the token icon. If the contract address is '0', it is treated as the native token. The icon source first tries to fetch from @web3icons/react, and if not found, falls back to the TrustWallet icon library.

## Features
- Accepts `chainId` and `address` as query parameters
- Returns the token icon as an image (SVG/PNG)
- Native token if address is '0'
- Prioritizes @web3icons/react, fallback to TrustWallet icons

## Usage
Deploy as a Cloudflare Worker. Example request:

```
GET /?chainId=1&address=0x6B175474E89094C44Da98b954EedeAC495271d0F
```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/slwyts/web3-icons-api)
