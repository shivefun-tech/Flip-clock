
import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Calendar as CalendarIcon, Clock as ClockIcon, Timer } from 'lucide-react';
import FlipDigit from './FlipDigit';
import { AppSettings, ThemeColors } from '../types';

interface CountdownViewProps {
  settings: AppSettings;
  theme: ThemeColors;
}

const CountdownView: React.FC<CountdownViewProps> = ({ settings, theme }) => {
  const [targetDate, setTargetDate] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('00:00');
  const [timeLeft, setTimeLeft] = useState<{ d: string, h: string, m: string, s: string } | null>(null);
  const [isActive, setIsActive] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return null;
    const [year, month, day] = targetDate.split('-').map(Number);
    const [hour, min] = targetTime.split(':').map(Number);
    const target = new Date(year, month - 1, day, hour, min, 0);
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      setIsActive(false);
      return { d: '00', h: '00', m: '00', s: '00' };
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const h = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const m = Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0');
    const s = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');

    return { d, h, m, s };
  }, [targetDate, targetTime]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, calculateTimeLeft]);

  const startCountdown = () => {
    if (targetDate) {
      setIsActive(true);
      setTimeLeft(calculateTimeLeft());
    }
  };

  const resetCountdown = () => {
    setIsActive(false);
    setTimeLeft(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 sm:px-8 gap-6 md:gap-16 overflow-y-auto landscape:py-8">
      <div className="text-center landscape:hidden">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4`}>
          <Timer size={14} className={theme.text} />
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${theme.text} opacity-50`}>Countdown Mode</span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-black ${theme.text} tracking-tight`}>Mechanical Timer</h2>
      </div>

      {!isActive && !timeLeft ? (
        <div className={`w-full max-w-sm landscape:max-w-xl p-6 sm:p-8 rounded-[48px] ${theme.cardBg} shadow-2xl space-y-6 md:space-y-8 border border-white/5`}>
          <div className="grid grid-cols-1 landscape:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-widest ${theme.text} opacity-40 flex items-center gap-2 ml-1`}>
                <CalendarIcon size={12} /> Target Date
              </label>
              <input 
                type="date" 
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full bg-black/30 border-0 rounded-2xl p-4 md:p-5 text-sm font-bold ${theme.text} focus:ring-2 focus:ring-white/20 outline-none transition-all`}
              />
            </div>
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-widest ${theme.text} opacity-40 flex items-center gap-2 ml-1`}>
                <ClockIcon size={12} /> Target Time
              </label>
              <input 
                type="time" 
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className={`w-full bg-black/30 border-0 rounded-2xl p-4 md:p-5 text-sm font-bold ${theme.text} focus:ring-2 focus:ring-white/20 outline-none transition-all`}
              />
            </div>
          </div>
          <button 
            onClick={startCountdown}
            disabled={!targetDate}
            className={`w-full py-5 md:py-6 rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs transition-all ${targetDate ? theme.accent + ' ' + theme.text + ' shadow-xl active:scale-[0.98]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'}`}
          >
            <Play size={18} fill="currentColor" /> Initiate
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 md:gap-20 landscape:scale-[0.75]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <div className="flex gap-1.5">
                <FlipDigit value={timeLeft?.d[0] || '0'} theme={theme} size="md" />
                <FlipDigit value={timeLeft?.d[1] || '0'} theme={theme} size="md" />
              </div>
              <span className={`text-[10px] font-black tracking-widest opacity-40 ${theme.text}`}>DAYS</span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <div className="flex gap-1.5">
                <FlipDigit value={timeLeft?.h[0] || '0'} theme={theme} size="md" />
                <FlipDigit value={timeLeft?.h[1] || '0'} theme={theme} size="md" />
              </div>
              <span className={`text-[10px] font-black tracking-widest opacity-40 ${theme.text}`}>HOURS</span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <div className="flex gap-1.5">
                <FlipDigit value={timeLeft?.m[0] || '0'} theme={theme} size="md" />
                <FlipDigit value={timeLeft?.m[1] || '0'} theme={theme} size="md" />
              </div>
              <span className={`text-[10px] font-black tracking-widest opacity-40 ${theme.text}`}>MINUTES</span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <div className="flex gap-1.5">
                <FlipDigit value={timeLeft?.s[0] || '0'} theme={theme} size="md" />
                <FlipDigit value={timeLeft?.s[1] || '0'} theme={theme} size="md" />
              </div>
              <span className={`text-[10px] font-black tracking-widest opacity-40 ${theme.text}`}>SECONDS</span>
            </div>
          </div>

          <button 
            onClick={resetCountdown}
            className={`px-8 md:px-10 py-4 md:py-5 rounded-3xl bg-white/10 ${theme.text} flex items-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all border border-white/10 hover:bg-white/20`}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default CountdownView;
