import React, { useEffect, useState } from 'react';
import { getTrackWeather, WeatherData } from '../utils/weather';

interface Props {
    slug: string;
}

export const TrackWeather: React.FC<Props> = ({ slug }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadWeather() {
            const data = await getTrackWeather(slug);
            setWeather(data);
            setLoading(false);
        }
        loadWeather();
    }, [slug]);

    if (loading) return (
        <div className="animate-pulse bg-slate-900 rounded-xl p-4 h-24 border border-slate-800 flex items-center justify-center">
            <span className="text-slate-500 text-xs font-semibold tracking-widest uppercase">Loading Local Weather...</span>
        </div>
    );

    if (!weather) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
            {/* Current Weather */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                            alt={weather.current.description}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{weather.current.temp}°C</p>
                        <p className="text-xs text-slate-400 capitalize">{weather.current.description}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hub-red">Live Info</p>
                    <p className="text-[9px] text-slate-500 mt-1 italic uppercase tracking-wider">Cached for 30m</p>
                </div>
            </div>

            {/* Forecast */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 overflow-x-auto shadow-sm">
                <div className="flex justify-between items-center h-full min-w-[200px]">
                    {weather.forecast.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day.date}</p>
                            <img
                                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt={day.description}
                                className="h-8 w-8 object-contain my-1"
                            />
                            <p className="text-sm font-semibold text-white">{day.temp}°C</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
