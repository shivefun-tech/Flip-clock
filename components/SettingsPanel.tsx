
import React, { useCallback } from 'react';
import { X, Clock, Calendar, Smartphone, CheckCircle2, RefreshCw, Edit3, Zap, Timer, Eye } from 'lucide-react';
import { AppSettings, ThemeId, ThemeColors, ClockSize } from '../types';
import { THEMES } from '../constants';

interface SettingsPanelProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeColors;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, updateSettings, isOpen, onClose, theme }) => {
  
  const triggerFeedback = useCallback((pattern: number | number[] = 10) => {
    if (settings.vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [settings.vibrateEnabled]);

  const getToggleButtonClass = (active: boolean) => {
    const base = "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shadow-inner";
    const bgColor = active ? theme.accent : 'bg-zinc-700/50';
    return base + " " + bgColor;
  };

  const handleUpdate = (s: Partial<AppSettings>) => {
    triggerFeedback(15);
    updateSettings(s);
  };

  const applyManualTime = () => {
    const newDateObj = new Date(settings.manualDate + "T" + settings.manualTime + ":00");
    const now = new Date();
    const offset = newDateObj.getTime() - now.getTime();
    handleUpdate({ manualOffset: offset, isManual: true });
  };

  const syncWithSystem = () => {
    handleUpdate({ 
      manualOffset: 0, 
      isManual: false,
      manualDate: new Date().toISOString().split('T')[0],
      manualTime: new Date().toTimeString().slice(0, 5)
    });
  };

  if (!isOpen) return null;

  const sizeOptions: { value: ClockSize; label: string }[] = [
    { value: 'sm', label: 'SMALL' },
    { value: 'md', label: 'MEDIUM' },
    { value: 'lg', label: 'LARGE' },
  ];

  return (
    <div className="fixed inset-0 z-50 transition-all duration-500 ease-in-out">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className={"absolute bottom-0 left-0 right-0 max-h-[90vh] " + theme.bg + " rounded-t-[48px] shadow-2xl overflow-y-auto transition-transform duration-500 transform " + (isOpen ? "translate-y-0" : "translate-y-full")}>
        {/* Pull Indicator */}
        <div className="flex justify-center py-4 cursor-pointer" onClick={onClose}>
          <div className="w-16 h-1.5 bg-zinc-500/20 rounded-full"></div>
        </div>

        <div className="px-6 sm:px-8 pb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={"text-3xl font-black " + theme.text + " tracking-tight"}>Settings</h2>
              <p className={"text-[10px] font-bold tracking-[0.3em] opacity-30 " + theme.text + " uppercase mt-1"}>Mechanical Logic</p>
            </div>
            <button 
              onClick={() => { triggerFeedback(5); onClose(); }} 
              className={"p-3 rounded-2xl " + theme.accent + " " + theme.text + " hover:scale-105 active:scale-95 transition-transform shadow-xl"}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Visual Visibility Options */}
            <div className="space-y-4">
              <label className={"text-[10px] font-black tracking-widest opacity-40 " + theme.text + " uppercase ml-1"}>Visibility</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'showDate', label: 'Show Full Date', icon: <Calendar size={18}/> },
                  { key: 'showSeconds', label: 'Show Seconds', icon: <Timer size={18}/> },
                  { key: 'showMilliseconds', label: 'Show Milliseconds', icon: <Zap size={18}/> },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={"p-2 rounded-xl bg-white/10 " + theme.text}>{item.icon}</div>
                      <p className={"font-bold text-sm " + theme.text}>{item.label}</p>
                    </div>
                    <button className={getToggleButtonClass((settings as any)[item.key])} onClick={() => handleUpdate({ [item.key]: !(settings as any)[item.key] })}>
                      <span className={"inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform " + ((settings as any)[item.key] ? "translate-x-6" : "translate-x-1")} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Format */}
            <div className="space-y-4">
              <label className={"text-[10px] font-black tracking-widest opacity-40 " + theme.text + " uppercase ml-1"}>Clock Engine</label>
              <div className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={"p-2 rounded-xl bg-white/10 " + theme.text}><Clock size={18} /></div>
                  <p className={"font-bold text-sm " + theme.text}>24-Hour Military Format</p>
                </div>
                <button className={getToggleButtonClass(settings.is24h)} onClick={() => handleUpdate({ is24h: !settings.is24h })}>
                  <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform " + (settings.is24h ? "translate-x-6" : "translate-x-1")} />
                </button>
              </div>
            </div>

            {/* Manual Time Correction */}
            <div className="space-y-4">
              <label className={"text-[10px] font-black tracking-widest opacity-40 " + theme.text + " uppercase ml-1"}>Manual Calibration</label>
              <div className="p-5 rounded-[40px] bg-white/5 border border-white/5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit3 size={16} className={theme.text + " opacity-60"} />
                    <p className={"text-sm font-bold " + theme.text}>Set Display Time</p>
                  </div>
                  {settings.isManual && (
                    <button 
                      onClick={syncWithSystem}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 animate-pulse"
                    >
                      <RefreshCw size={10} /> Live Sync
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black opacity-30 uppercase ml-2 mb-1">Date</p>
                    <input 
                      type="date" 
                      value={settings.manualDate} 
                      onChange={(e) => handleUpdate({ manualDate: e.target.value })}
                      className="w-full bg-black/30 border-0 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-white/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black opacity-30 uppercase ml-2 mb-1">Time</p>
                    <input 
                      type="time" 
                      value={settings.manualTime} 
                      onChange={(e) => handleUpdate({ manualTime: e.target.value })}
                      className="w-full bg-black/30 border-0 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-white/10 transition-all"
                    />
                  </div>
                </div>
                <button 
                  onClick={applyManualTime}
                  className={"w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all " + theme.accent + " " + theme.text + " shadow-xl active:scale-95"}
                >
                  Adjust Gears
                </button>
              </div>
            </div>

            {/* Granular Haptics */}
            <div className="space-y-4">
              <label className={"text-[10px] font-black tracking-widest opacity-40 " + theme.text + " uppercase ml-1"}>Haptic Engine</label>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className={"p-2 rounded-xl bg-white/10 " + theme.text}><Smartphone size={18} /></div>
                    <p className={"font-bold text-sm " + theme.text}>Master Vibration</p>
                  </div>
                  <button className={getToggleButtonClass(settings.vibrateEnabled)} onClick={() => handleUpdate({ vibrateEnabled: !settings.vibrateEnabled })}>
                    <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform " + (settings.vibrateEnabled ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                {settings.vibrateEnabled && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    {[
                      { key: 'vibrateOnSecond', label: 'Pulse on Second' },
                      { key: 'vibrateOnMinute', label: 'Pulse on Minute' },
                      { key: 'vibrateOnHour', label: 'Pulse on Hour' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between ml-4">
                        <p className={"text-xs font-bold " + theme.text + " opacity-60"}>{item.label}</p>
                        <button className={getToggleButtonClass((settings as any)[item.key])} onClick={() => handleUpdate({ [item.key]: !(settings as any)[item.key] })}>
                          <span className={"inline-block h-3 w-3 transform rounded-full bg-white transition-transform " + ((settings as any)[item.key] ? "translate-x-7" : "translate-x-1")} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scale Options */}
            <div className="space-y-4">
              <label className={"text-[10px] font-black tracking-widest opacity-40 " + theme.text + " uppercase ml-1"}>Visual Scale</label>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((opt) => {
                  const isActive = settings.clockSize === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdate({ clockSize: opt.value })}
                      className={"p-4 rounded-2xl text-[10px] font-black tracking-widest transition-all " + (isActive ? (theme.accent + " " + theme.text + " shadow-xl scale-105") : "bg-white/5 text-zinc-500 opacity-60")}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
              <label className={"text-[10px] font-black tracking-widest opacity-40 " + theme.text + " uppercase ml-1"}>Aesthetic Themes</label>
              <div className="grid grid-cols-5 gap-4">
                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                  const isActive = settings.theme === tId;
                  return (
                    <button
                      key={tId}
                      onClick={() => handleUpdate({ theme: tId })}
                      className={"group relative h-16 rounded-3xl overflow-hidden border-2 transition-all duration-300 " + (isActive ? "ring-2 ring-white border-white scale-110 shadow-2xl" : "border-transparent opacity-50")}
                    >
                      <div className={"absolute inset-0 " + THEMES[tId].bg}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isActive && <CheckCircle2 size={16} className="text-white drop-shadow-lg" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
