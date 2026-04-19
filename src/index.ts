export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const chainId = url.searchParams.get('chainId');
    const address = url.searchParams.get('address');
    const symbol = url.searchParams.get('symbol');
    const ONE_YEAR = 31536000;
    const ONE_DAY = 86400;

    if (!chainId || (!address && !symbol)) {
      return new Response('Missing chainId and address or symbol', { status: 400 });
    }

    const bust = url.searchParams.get('bust') === 'true';

    // Check cache first
    const cache = caches.default;
    const cacheKey = new URL(request.url);
    cacheKey.searchParams.delete('bust');
    const cached = await cache.match(cacheKey);
    if (cached && !bust) {
      return cached;
    }

    const chainIdToName: Record<string, string> = {
      '1': 'ethereum',
      '10': 'optimism',
      '56': 'smartchain',
      '137': 'polygon',
      '143': 'monad',
      '324': 'zksync',
      '8453': 'base',
      '59144': 'linea',
      '42161': 'arbitrum',
      '4326': 'megaeth',
      '534352': 'scroll',
      '81457': 'blast',
      '9745': 'plasma',
      '999': 'hyperevm',
      '57073': 'ink',
      '232': 'lens',
      '1135': 'lisk',
      '34443': 'mode',
      '1868': 'soneium',
      '4217': 'tempo',
      '130': 'unichain',
      '480': 'world-chain',
      '7777777': 'zora',
      '9998': 'lighter',
      '1337': 'hypercore',
      '100': 'xdai',
      '204': 'opbnb',
      '250': 'fantom',
      '288': 'boba',
      '1088': 'metis',
      '128': 'heco',
      '169': 'manta',
      '5000': 'mantle',
      '7000': 'zetachain',
      '1101': 'polygonzkevm',
      '42220': 'celo',
      '43114': 'avalanchec',
      '1284': 'moonbeam',
      '1285': 'moonriver',
      '25': 'cronos',
      '1313161554': 'aurora',
      '30': 'rootstock',
      '61': 'classic',
      '40': 'telos',
      '50': 'xdc',
      '57': 'syscoin',
      '82': 'meter',
      '88': 'viction',
      '106': 'velas',
      '108': 'thundertoken',
      '122': 'fuse',
      '146': 'sonic',
      '2000': 'kavaevm',
      '2222': 'kava',
      '1666600000': 'harmony',
      '336': 'shiden',
      '4200': 'merlin',
      '1030': 'conflux',
      '888888888': 'xdai', // canto (uses same icon)
      '999999999': 'nativecanto',
      '34268394551451': 'solana',
    };

    const isNativeToken = address === '0' || address === null || address.toLowerCase() === '0x0000000000000000000000000000000000000000';

    const fetchWithCache = async (upstreamUrl: string, contentType: 'image/png' | 'image/svg+xml'): Promise<Response | null> => {
      const upstreamRequest = new Request(bust ? `${upstreamUrl}?bust=${Date.now()}` : upstreamUrl);

      const res = await fetch(upstreamRequest, {
        cf: {
          cacheEverything: !bust,
          cacheTtl: ONE_YEAR,
          cacheTtlByStatus: { '200-299': ONE_YEAR, '404': ONE_DAY, '500-599': 0 },
        },
      });

      if (!res.ok) return null;

      const response = new Response(contentType === 'image/svg+xml' ? await res.text() : res.body, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': `public, max-age=${ONE_YEAR}, immutable`,
          'CDN-Cache-Control': `public, max-age=${ONE_YEAR}`,
          'Cloudflare-CDN-Cache-TTL': ONE_YEAR.toString(),
        },
      });

      await cache.put(cacheKey, response.clone());
      return response;
    };

    if (isNativeToken) {
      const chainName = chainIdToName[chainId] || 'ethereum';
      const trustWalletNativeUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/info/logo.png`;
      const res = await fetchWithCache(trustWalletNativeUrl, 'image/png');
      if (res) return res;
      const alexandriaChainUrl = `https://alexandria-blond.vercel.app/assets/chains/${chainName}.svg`;
      const alexandriaRes = await fetchWithCache(alexandriaChainUrl, 'image/svg+xml');
      if (alexandriaRes) return alexandriaRes;
      return new Response('Icon not found', { status: 404 });
    }

    if (address) {
      const web3iconsUrl = `https://raw.githubusercontent.com/0xa3k5/web3icons/main/packages/core/src/svgs/tokens/branded/${address}.svg`;
      const svgRes = await fetchWithCache(web3iconsUrl, 'image/svg+xml');
      if (svgRes) return svgRes;

      const chainName = chainIdToName[chainId] || 'ethereum';
      const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${address}/logo.png`;
      const pngRes = await fetchWithCache(trustWalletUrl, 'image/png');
      if (pngRes) return pngRes;
    }

    if (symbol) {
      const alexandriaTokenUrl = `https://alexandria-blond.vercel.app/assets/tokens/${symbol}.svg`;
      const alexandriaRes = await fetchWithCache(alexandriaTokenUrl, 'image/svg+xml');
      if (alexandriaRes) return alexandriaRes;

      const web3iconsSymbolUrl = `https://raw.githubusercontent.com/0xa3k5/web3icons/refs/heads/main/packages/core/src/svgs/tokens/branded/${symbol}.svg`;
      const symbolRes = await fetchWithCache(web3iconsSymbolUrl, 'image/svg+xml');
      if (symbolRes) return symbolRes;
    }

    return new Response('Icon not found', { status: 404 });
  },
};
