
import React, { useState, useCallback, useRef } from 'react';
import { AppSettings, ScreenMode } from './types';
import { THEMES } from './constants';
import ClockView from './components/ClockView';
import CountdownView from './components/CountdownView';
import StopwatchView from './components/StopwatchView';
import SettingsPanel from './components/SettingsPanel';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    is24h: true,
    showDate: true,
    showMilliseconds: false,
    showSeconds: true,
    theme: 'dark',
    clockSize: 'md',
    isManual: false,
    manualOffset: 0,
    manualDate: new Date().toISOString().split('T')[0],
    manualTime: new Date().toTimeString().slice(0, 5),
    vibrateEnabled: true,
    vibrateOnSecond: false,
    vibrateOnMinute: true,
    vibrateOnHour: true,
  });

  const [mode, setMode] = useState<ScreenMode>('clock');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const theme = THEMES[settings.theme];

  const triggerFeedback = useCallback((pattern: number | number[] = 10) => {
    if (settings.vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }, [settings.vibrateEnabled]);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const nextMode = useCallback(() => {
    triggerFeedback(20);
    setMode(prev => {
      if (prev === 'clock') return 'countdown';
      if (prev === 'countdown') return 'stopwatch';
      return 'clock';
    });
  }, [triggerFeedback]);

  const prevMode = useCallback(() => {
    triggerFeedback(20);
    setMode(prev => {
      if (prev === 'clock') return 'stopwatch';
      if (prev === 'stopwatch') return 'countdown';
      return 'clock';
    });
  }, [triggerFeedback]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const xDiff = touchStart.current.x - e.changedTouches[0].clientX;
    const yDiff = touchStart.current.y - e.changedTouches[0].clientY;
    const threshold = 75; 

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > threshold) {
      if (xDiff > 0) nextMode();
      else prevMode();
    } 
    else if (yDiff > threshold) {
      triggerFeedback(15);
      setIsSettingsOpen(true);
    }
    else if (yDiff < -threshold && isSettingsOpen) {
      triggerFeedback(5);
      setIsSettingsOpen(false);
    }
    touchStart.current = null;
  };

  const getIndicatorStyle = (isActive: boolean) => {
    const base = "h-1.5 rounded-full transition-all duration-300 ";
    if (isActive) {
      const bgColor = theme.text.replace('text-', 'bg-') || 'bg-white';
      return base + "w-4 " + bgColor;
    }
    return base + "w-1.5 bg-zinc-600 opacity-30";
  };

  const renderContent = () => {
    switch (mode) {
      case 'clock': return <ClockView settings={settings} theme={theme} />;
      case 'countdown': return <CountdownView settings={settings} theme={theme} />;
      case 'stopwatch': return <StopwatchView settings={settings} theme={theme} />;
    }
  };

  return (
    <div 
      className={"relative w-full h-full transition-colors duration-700 overflow-hidden flex flex-col " + theme.bg}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute top-4 sm:top-6 md:top-8 left-0 right-0 px-8 flex justify-between items-center z-10 landscape:top-2">
        <div className={"text-[10px] font-bold uppercase tracking-[0.5em] opacity-20 " + theme.text + " landscape:opacity-10"}>
          CHRONOS FLIP
        </div>
        <button 
          onClick={() => { triggerFeedback(15); setIsSettingsOpen(true); }}
          className={"p-2.5 sm:p-3 rounded-2xl shadow-xl active:scale-90 transition-transform " + theme.accent + " " + theme.text}
        >
          <Menu size={18} />
        </button>
      </div>

      <main className="flex-1 w-full flex items-center justify-center transition-all duration-500 relative">
        <div className="w-full h-full flex items-center justify-center p-4">
          {renderContent()}
        </div>
      </main>

      <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 flex justify-center gap-2 pointer-events-none landscape:bottom-4">
        <div className={getIndicatorStyle(mode === 'clock')} />
        <div className={getIndicatorStyle(mode === 'countdown')} />
        <div className={getIndicatorStyle(mode === 'stopwatch')} />
      </div>

      <div className={"absolute bottom-3 sm:bottom-4 left-0 right-0 text-center text-[7px] sm:text-[8px] font-bold uppercase tracking-widest opacity-10 pointer-events-none " + theme.text + " landscape:hidden"}>
        Swipe side to change mode • Swipe up for settings
      </div>

      <SettingsPanel 
        settings={settings} 
        updateSettings={handleUpdateSettings} 
        isOpen={isSettingsOpen} 
        onClose={() => { triggerFeedback(5); setIsSettingsOpen(false); }}
        theme={theme}
      />
    </div>
  );
};

export default App;
