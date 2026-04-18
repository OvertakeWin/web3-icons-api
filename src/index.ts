export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const chainId = url.searchParams.get('chainId');
    const address = url.searchParams.get('address');
    const CACHE_CONTROL = `public, max-age=2678400`; // 1 month

    if (!chainId || !address) {
      return new Response('Missing chainId or address', { status: 400 });
    }

    const chainIdToName: Record<string, string> = {
      '1': 'ethereum',
      '56': 'smartchain',
      '137': 'polygon',
      '10': 'optimism',
      '42161': 'arbitrum',
      '43114': 'avalanchec',
      '250': 'fantom',
      '8453': 'base',
      '324': 'zksync',
      '59144': 'linea',
      '100': 'xdai',
      '534352': 'scroll',
      '81457': 'blast',
      '169': 'manta',
      '5000': 'mantle',
      '34443': 'mode',
      '7000': 'zetachain',
      '1101': 'polygonzkevm',
      '204': 'opbnb',
      '288': 'boba',
      '1088': 'metis',
      '42220': 'celo',
      '1284': 'moonbeam',
      '1285': 'moonriver',
      '25': 'cronos',
      '1313161554': 'aurora',
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
