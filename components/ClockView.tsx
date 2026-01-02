
import React, { useState, useEffect, useRef } from 'react';
import FlipDigit from './FlipDigit';
import { AppSettings, ThemeColors } from '../types';

interface ClockViewProps {
  settings: AppSettings;
  theme: ThemeColors;
}

const ClockView: React.FC<ClockViewProps> = ({ settings, theme }) => {
  const [time, setTime] = useState(new Date());
  const prevTimeRef = useRef(new Date());

  useEffect(() => {
    const handleTick = () => {
      const now = new Date(Date.now() + settings.manualOffset);
      
      if (settings.vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        const s = now.getSeconds();
        const m = now.getMinutes();
        const h = now.getHours();
        
        const prevS = prevTimeRef.current.getSeconds();
        const prevM = prevTimeRef.current.getMinutes();
        const prevH = prevTimeRef.current.getHours();

        if (settings.vibrateOnHour && h !== prevH) {
          navigator.vibrate([200, 100, 200]);
        } else if (settings.vibrateOnMinute && m !== prevM) {
          navigator.vibrate(60);
        } else if (settings.vibrateOnSecond && s !== prevS) {
          navigator.vibrate(10);
        }
      }

      setTime(now);
      prevTimeRef.current = now;
    };

    const interval = settings.showMilliseconds ? 10 : 1000;
    const timer = setInterval(handleTick, interval);
    return () => clearInterval(timer);
  }, [settings.manualOffset, settings.showMilliseconds, settings.vibrateEnabled, settings.vibrateOnHour, settings.vibrateOnMinute, settings.vibrateOnSecond]);

  const formatTime = () => {
    let hours = time.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (!settings.is24h) {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }
    const h = hours.toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(time.getMilliseconds() / 10).toString().padStart(2, '0');
    return { h, m, s, ms, ampm };
  };

  const { h, m, s, ms, ampm } = formatTime();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dateStr = time.getDate() + " " + months[time.getMonth()] + " " + time.getFullYear();
  const dayName = days[time.getDay()];

  const containerScale = {
    sm: 'scale-[0.55] landscape:scale-[0.45] sm:scale-75 md:scale-90',
    md: 'scale-[0.65] landscape:scale-[0.5] sm:scale-90 md:scale-100',
    lg: 'scale-[0.8] landscape:scale-[0.6] sm:scale-105 md:scale-120',
  };

  const digitSize = settings.clockSize === 'sm' ? 'md' : (settings.clockSize === 'md' ? 'lg' : 'xl');

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full p-4 transition-all duration-700 ${containerScale[settings.clockSize]}`}>
      
      {/* Cards Row */}
      <div className="flex flex-row items-center justify-center gap-6 md:gap-16 max-w-full">
        {/* HOURS */}
        <div className="flex items-center gap-1 md:gap-3">
          <FlipDigit value={h[0]} theme={theme} size={digitSize} />
          <FlipDigit value={h[1]} theme={theme} size={digitSize} />
        </div>

        {/* Separator dots - Cinematic blinking */}
        <div className={`flex flex-col gap-8 md:gap-12 transition-opacity duration-1000 ${time.getSeconds() % 2 === 0 ? 'opacity-20' : 'opacity-5'}`}>
          <div className={`w-3 h-3 md:w-5 md:h-5 rounded-full ${theme.text} bg-current shadow-[0_0_20px_rgba(255,255,255,0.3)]`} />
          <div className={`w-3 h-3 md:w-5 md:h-5 rounded-full ${theme.text} bg-current shadow-[0_0_20px_rgba(255,255,255,0.3)]`} />
        </div>

        {/* MINUTES */}
        <div className="flex items-center gap-1 md:gap-3">
          <FlipDigit value={m[0]} theme={theme} size={digitSize} />
          <FlipDigit value={m[1]} theme={theme} size={digitSize} />
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-12 md:mt-24 flex flex-col items-center gap-6 md:gap-10 landscape:mt-8">
        {settings.showDate && (
          <div className="flex flex-col items-center gap-2 landscape:flex-row landscape:gap-8">
            <div className={`text-xs md:text-sm font-black tracking-[0.8em] opacity-40 uppercase ${theme.text}`}>
              {dayName}
            </div>
            <div className={`text-sm md:text-base font-bold tracking-[0.4em] opacity-20 ${theme.text}`}>
              {dateStr}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {!settings.is24h && (
            <div className={`px-6 py-2 rounded-2xl border border-white/5 bg-white/5 text-xs font-black tracking-widest opacity-40 uppercase ${theme.text}`}>
              {ampm}
            </div>
          )}

          {(settings.showSeconds || settings.showMilliseconds) && (
            <div className="flex items-center gap-6 px-8 py-3 rounded-[32px] bg-black/40 border border-white/5 shadow-inner">
              {settings.showSeconds && (
                <div className="flex gap-2 items-center">
                  <span className={`text-[10px] font-black opacity-20 mr-2 ${theme.text}`}>SEC</span>
                  <FlipDigit value={s[0]} theme={theme} size="sm" />
                  <FlipDigit value={s[1]} theme={theme} size="sm" />
                </div>
              )}
              {settings.showMilliseconds && (
                <div className="flex gap-2 items-center border-l border-white/10 pl-6">
                  <span className={`text-[10px] font-black opacity-20 mr-2 ${theme.text}`}>MS</span>
                  <FlipDigit value={ms[0]} theme={theme} size="sm" animate={false} />
                  <FlipDigit value={ms[1]} theme={theme} size="sm" animate={false} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Premium Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.4)_100%)] z-40"></div>
    </div>
  );
};

export default ClockView;
