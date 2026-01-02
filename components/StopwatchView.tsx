
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Timer } from 'lucide-react';
import FlipDigit from './FlipDigit';
import { AppSettings, ThemeColors } from '../types';

interface StopwatchViewProps {
  settings: AppSettings;
  theme: ThemeColors;
}

const StopwatchView: React.FC<StopwatchViewProps> = ({ settings, theme }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return { m: minutes, s: seconds, ms: milliseconds };
  };

  const tick = useCallback(() => {
    setTime(Date.now() - startTimeRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      timerRef.current = window.setInterval(tick, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, tick]);

  const handleStartStop = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => {
    if (time > 0) setLaps([time, ...laps]);
  };

  const { m, s, ms } = formatTime(time);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 gap-8 md:gap-16 landscape:flex-row landscape:gap-12">
      
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <Timer size={14} className={theme.text} />
            <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${theme.text} opacity-50`}>Precision Stopwatch</span>
          </div>
        </div>

        {/* Flip Cards Container */}
        <div className={`flex items-center gap-4 md:gap-8 scale-90 sm:scale-100 ${theme.cardBg} p-6 rounded-[48px] shadow-2xl relative`}>
          <div className="flex flex-col items-center gap-2">
             <div className="flex -space-x-1">
                <FlipDigit value={m[0]} theme={theme} size="lg" />
                <FlipDigit value={m[1]} theme={theme} size="lg" />
             </div>
             <span className={`text-[8px] font-black tracking-widest opacity-30 ${theme.text}`}>MIN</span>
          </div>
          
          <div className={`text-4xl font-black opacity-20 ${theme.text}`}>:</div>

          <div className="flex flex-col items-center gap-2">
             <div className="flex -space-x-1">
                <FlipDigit value={s[0]} theme={theme} size="lg" />
                <FlipDigit value={s[1]} theme={theme} size="lg" />
             </div>
             <span className={`text-[8px] font-black tracking-widest opacity-30 ${theme.text}`}>SEC</span>
          </div>

          <div className="flex flex-col items-center gap-2 pl-4 border-l border-white/5">
             <div className="flex -space-x-0.5">
                <FlipDigit value={ms[0]} theme={theme} size="sm" animate={false} />
                <FlipDigit value={ms[1]} theme={theme} size="sm" animate={false} />
             </div>
             <span className={`text-[8px] font-black tracking-widest opacity-30 ${theme.text}`}>MS</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleReset}
            className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${theme.text} active:scale-90 transition-transform`}
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            onClick={handleStartStop}
            className={`w-20 h-20 rounded-full flex items-center justify-center ${theme.accent} ${theme.text} shadow-2xl active:scale-95 transition-all`}
          >
            {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleLap}
            className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${theme.text} active:scale-90 transition-transform`}
          >
            <Flag size={20} />
          </button>
        </div>
      </div>

      {/* Lap List */}
      <div className={`w-full max-w-[280px] h-[300px] overflow-y-auto rounded-3xl bg-black/20 border border-white/5 p-4 custom-scrollbar ${laps.length === 0 ? 'opacity-20' : ''}`}>
        {laps.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] font-black tracking-widest uppercase text-zinc-600">No Laps Recorded</div>
        ) : (
          <div className="space-y-2">
            {laps.map((lapTime, index) => {
              const formatted = formatTime(lapTime);
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-black opacity-30 text-white">#{laps.length - index}</span>
                  <span className={`text-sm font-bold mono ${theme.text}`}>
                    {formatted.m}:{formatted.s}.<span className="text-[10px] opacity-60">{formatted.ms}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StopwatchView;
