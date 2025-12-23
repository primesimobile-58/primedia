
const yahooFinance = require('yahoo-finance2').default;

const STOCK_SYMBOLS = [
  { symbol: 'XU100.IS', name: 'BIST 100', type: 'bist_index' },
  { symbol: 'THYAO.IS', name: 'THY', type: 'bist_stock' },
  { symbol: 'AAPL', name: 'Apple', type: 'global_stock' },
];

async function testFinance() {
  console.log('Fetching stock data...');
  try {
    const results = await Promise.all(
      STOCK_SYMBOLS.map(async (item) => {
        try {
          const quote = await yahooFinance.quote(item.symbol);
          console.log(`Success for ${item.symbol}:`, quote.regularMarketPrice);
          return quote;
        } catch (err) {
          console.error(`Error fetching stock ${item.symbol}:`, err.message);
          return null;
        }
      })
    );
    console.log('Done.');
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

testFinance();
