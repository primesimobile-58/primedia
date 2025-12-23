
import defaultExport, * as allExports from 'yahoo-finance2';

console.log('All exports keys:', Object.keys(allExports));

async function testFinance() {
  try {
      console.log('--- Attempt 1: Instantiate default export ---');
      try {
          const yf = new defaultExport();
          const res = await yf.quote('AAPL');
          console.log('Success with new defaultExport():', res.regularMarketPrice);
      } catch (e) {
          console.log('Failed new defaultExport():', e.message);
      }

      console.log('--- Attempt 2: Use yahooFinance named export (if exists) ---');
      if (allExports.yahooFinance) {
           try {
              const res = await allExports.yahooFinance.quote('AAPL');
              console.log('Success with allExports.yahooFinance.quote:', res.regularMarketPrice);
           } catch(e) {
              console.log('Failed allExports.yahooFinance.quote:', e.message);
           }
      } else {
          console.log('No yahooFinance named export');
      }
  } catch (e) {
      console.error('Fatal:', e);
  }
}

testFinance();
