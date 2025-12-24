'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

export default function WeatherWidget({ lang }: { lang: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Istanbul coordinates: 41.0082, 28.9784
    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,weather_code&timezone=auto')
      .then(res => res.json())
      .then(data => {
        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code
          });
        }
      })
      .catch(err => console.error('Weather fetch error:', err));
  }, []);

  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun size={18} className="text-yellow-500" />;
    if (code === 2 || code === 3) return <Cloud size={18} className="text-gray-400" />;
    if (code >= 45 && code <= 48) return <Wind size={18} className="text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain size={18} className="text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={18} className="text-blue-200" />;
    if (code >= 80 && code <= 82) return <CloudRain size={18} className="text-blue-500" />;
    if (code >= 95) return <CloudLightning size={18} className="text-yellow-600" />;
    return <Sun size={18} className="text-yellow-500" />;
  };

  const cityName = lang === 'en' ? 'Istanbul' : lang === 'ar' ? 'إسطنبول' : 'İstanbul';

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-full border border-blue-100 hover:bg-blue-50 transition-colors cursor-default">
      {getWeatherIcon(weather.weatherCode)}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{cityName}</span>
        <span className="text-sm font-bold text-gray-700">{weather.temperature}°C</span>
      </div>
    </div>
  );
}
