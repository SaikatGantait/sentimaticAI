// Mock API services for the trading dashboard

export async function fetchMockTokens() {
  return [
    { symbol: 'APT', name: 'Aptos', price: 8.42, market: 'Crypto', liquidityUsd: 45000000, change24h: 5.2 },
    { symbol: 'MEME', name: 'Meme Coin', price: 0.0042, market: 'Meme', liquidityUsd: 1200000, change24h: -2.1 },
    { symbol: 'PRIV', name: 'Privacy Token', price: 12.34, market: 'Privacy', liquidityUsd: 8900000, change24h: 8.7 },
    { symbol: 'ZLA', name: 'Zilla', price: 0.89, market: 'Gaming', liquidityUsd: 560000, change24h: 15.3 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, market: 'Meme', liquidityUsd: 89000000, change24h: -0.8 },
  ];
}

export async function fetchMockWallets() {
  return [
    { address: '0x1234...5678', name: 'Main Wallet', tokens: ['APT', 'MEME'], value: 12450.50 },
    { address: '0xabcd...efgh', name: 'Trading Wallet', tokens: ['PRIV', 'ZLA'], value: 8920.25 },
  ];
}

export async function fetchMockSentiment(symbol: string) {
  const sentiments: Record<string, any> = {
    APT: { score: 0.85, twitter: 'Bullish', twitterVolume: 45000, cmc: { rank: 35 }, greedFear: 72 },
    MEME: { score: 0.92, twitter: 'Very Bullish', twitterVolume: 128000, cmc: { rank: 156 }, greedFear: 85 },
    PRIV: { score: 0.65, twitter: 'Neutral', twitterVolume: 12000, cmc: { rank: 89 }, greedFear: 58 },
    ZLA: { score: 0.78, twitter: 'Bullish', twitterVolume: 8500, cmc: { rank: 245 }, greedFear: 68 },
    DOGE: { score: 0.55, twitter: 'Mixed', twitterVolume: 98000, cmc: { rank: 12 }, greedFear: 52 },
  };
  
  return sentiments[symbol] || { score: 0.5, twitter: 'Unknown', twitterVolume: 0, cmc: { rank: 999 }, greedFear: 50 };
}
