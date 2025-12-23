'use client';

import { useEffect, useRef, memo } from 'react';

export default function TradingViewWidget({ lang }: { lang: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const locale = lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'tr';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BIST:XU100",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "${locale}",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    
    if (container.current) {
      container.current.innerHTML = ''; // Clear previous content
      container.current.appendChild(script);
    }
  }, [lang]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "500px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}