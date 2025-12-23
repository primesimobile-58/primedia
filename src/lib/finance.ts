import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  type: 'currency' | 'crypto' | 'stock' | 'commodity' | 'bist_index' | 'bist_stock' | 'global_index' | 'global_stock';
}

const SYMBOLS = [
  { symbol: 'TRY=X', name: 'USD/TRY', type: 'currency' },
  { symbol: 'EURTRY=X', name: 'EUR/TRY', type: 'currency' },
  { symbol: 'GBPTRY=X', name: 'GBP/TRY', type: 'currency' },
  { symbol: 'BTC-USD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH-USD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'GC=F', name: 'Altın (Ons)', type: 'commodity' },
  { symbol: 'SI=F', name: 'Gümüş', type: 'commodity' },
  { symbol: 'CL=F', name: 'Ham Petrol', type: 'commodity' },
  { symbol: 'XU100.IS', name: 'BIST 100', type: 'stock' },
  { symbol: '^GSPC', name: 'S&P 500', type: 'stock' },
  { symbol: '^IXIC', name: 'Nasdaq', type: 'stock' },
];

export async function fetchMarketData(): Promise<MarketData[]> {
  try {
    const results = await Promise.all(
      SYMBOLS.map(async (item) => {
        try {
          const quote = await yahooFinance.quote(item.symbol) as any;
          const data: MarketData = {
            symbol: item.symbol,
            name: item.name,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            currency: quote.currency,
            type: item.type as any,
          };
          return data;
        } catch (err) {
          console.error(`Error fetching ${item.symbol}:`, err);
          return null;
        }
      })
    );

    return results.filter((item): item is MarketData => item !== null);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}

const STOCK_SYMBOLS = [
  // BIST Indices
  { symbol: 'XU100.IS', name: 'BIST 100', type: 'bist_index' },
  { symbol: 'XU030.IS', name: 'BIST 30', type: 'bist_index' },
  { symbol: 'XU050.IS', name: 'BIST 50', type: 'bist_index' },
  { symbol: 'XBANK.IS', name: 'BIST Banka', type: 'bist_index' },
  // BIST Stocks (Popular)
  { symbol: 'THYAO.IS', name: 'THY', type: 'bist_stock' },
  { symbol: 'GARAN.IS', name: 'Garanti BBVA', type: 'bist_stock' },
  { symbol: 'AKBNK.IS', name: 'Akbank', type: 'bist_stock' },
  { symbol: 'ASELS.IS', name: 'Aselsan', type: 'bist_stock' },
  { symbol: 'EREGL.IS', name: 'Ereğli Demir Çelik', type: 'bist_stock' },
  { symbol: 'KCHOL.IS', name: 'Koç Holding', type: 'bist_stock' },
  { symbol: 'SAHOL.IS', name: 'Sabancı Holding', type: 'bist_stock' },
  { symbol: 'TUPRS.IS', name: 'Tüpraş', type: 'bist_stock' },
  { symbol: 'SISE.IS', name: 'Şişecam', type: 'bist_stock' },
  { symbol: 'BIMAS.IS', name: 'BİM Mağazalar', type: 'bist_stock' },
  // Global Indices
  { symbol: '^GSPC', name: 'S&P 500', type: 'global_index' },
  { symbol: '^DJI', name: 'Dow Jones', type: 'global_index' },
  { symbol: '^IXIC', name: 'Nasdaq', type: 'global_index' },
  { symbol: '^GDAXI', name: 'DAX', type: 'global_index' },
  { symbol: '^FTSE', name: 'FTSE 100', type: 'global_index' },
  { symbol: '^N225', name: 'Nikkei 225', type: 'global_index' },
  // Global Stocks
  { symbol: 'AAPL', name: 'Apple', type: 'global_stock' },
  { symbol: 'TSLA', name: 'Tesla', type: 'global_stock' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'global_stock' },
  { symbol: 'AMZN', name: 'Amazon', type: 'global_stock' },
  { symbol: 'NVDA', name: 'Nvidia', type: 'global_stock' },
  { symbol: 'GOOGL', name: 'Alphabet', type: 'global_stock' },
  { symbol: 'META', name: 'Meta', type: 'global_stock' },
];

export async function fetchStockData(): Promise<MarketData[]> {
  try {
    const results = await Promise.all(
      STOCK_SYMBOLS.map(async (item) => {
        try {
          const quote = await yahooFinance.quote(item.symbol) as any;
          const data: MarketData = {
            symbol: item.symbol,
            name: item.name,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            currency: quote.currency,
            type: item.type as any,
          };
          return data;
        } catch (err) {
          console.error(`Error fetching stock ${item.symbol}:`, err);
          return null;
        }
      })
    );
    return results.filter((item): item is MarketData => item !== null);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}
