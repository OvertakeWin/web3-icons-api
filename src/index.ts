export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const chainId = url.searchParams.get('chainId');
    const address = url.searchParams.get('address');
    const CACHE_CONTROL = 'public, max-age=2678400'; // 1 month

    if (!chainId || !address) {
      return new Response('Missing chainId or address', { status: 400 });
    }

    const chainIdToName: Record<string, string> = {
      // Across-supported chains
      '1': 'ethereum',
      '10': 'optimism',
      '56': 'smartchain',
      '130': 'ethereum', // unichain (fallback to eth for native)
      '137': 'polygon',
      '143': 'monad',
      '324': 'zksync',
      '8453': 'base',
      '59144': 'linea',
      '42161': 'arbitrum',
      '4326': 'megaeth',
      '534352': 'scroll',
      '81457': 'blast',
      '34443': 'ethereum', // mode (fallback)
      '7777777': 'ethereum', // zora (fallback)
      '9745': 'plasma',
      '1868': 'ethereum', // soneium (fallback)
      '999': 'ethereum', // hyperevm (fallback)
      '57073': 'ethereum', // ink (fallback)
      '232': 'ethereum', // lens (fallback)
      '1135': 'ethereum', // lisk (fallback)
      '4217': 'ethereum', // tempo (fallback)
      '480': 'ethereum', // world chain (fallback)
      // Other major chains in trustwallet
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
      '888888888': 'xdai', // canto (uses same icon)
      '336': 'shiden',
      '888': 'ethereum', // vision (fallback)
      '4200': 'merlin',
      '1030': 'conflux',
      '999999999': 'nativecanto',
      '940': 'ethereum', // pulsechain (fallback)
    };

    const isNativeToken = address === '0' || address.toLowerCase() === '0x0000000000000000000000000000000000000000';
    if (isNativeToken) {
      const chainName = chainIdToName[chainId] || 'ethereum';
      const trustWalletNativeUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/info/logo.png`;
      const iconRes = await fetch(trustWalletNativeUrl);
      if (iconRes.ok) {
        return new Response(iconRes.body, {
          headers: { 'Content-Type': 'image/png', 'Cache-Control': CACHE_CONTROL },
        });
      }
      return new Response('Icon not found', { status: 404 });
    }

    const web3iconsUrl = `https://raw.githubusercontent.com/0xa3k5/web3icons/main/packages/core/src/svgs/tokens/branded/${address}.svg`;
    let iconRes = await fetch(web3iconsUrl);
    if (iconRes.ok) {
      return new Response(await iconRes.text(), {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': CACHE_CONTROL },
      });
    }

    const chainName = chainIdToName[chainId] || 'ethereum';
    const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${address}/logo.png`;
    iconRes = await fetch(trustWalletUrl);
    if (iconRes.ok) {
      return new Response(iconRes.body, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': CACHE_CONTROL },
      });
    }

    return new Response('Icon not found', { status: 404 });
  },
};
