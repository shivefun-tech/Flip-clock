
import React, { useState, useEffect, useRef } from 'react';
import { ThemeColors } from '../types';

interface FlipDigitProps {
  value: string;
  theme: ThemeColors;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const FlipDigit: React.FC<FlipDigitProps> = ({ value, theme, size = 'lg', animate = true }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (!animate) {
        setCurrentValue(value);
        setNextValue(value);
        prevValueRef.current = value;
        return;
      }

      setNextValue(value);
      setIsFlipping(true);
      
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
        prevValueRef.current = value;
      }, 550); // Duration matches the CSS transition
      
      return () => clearTimeout(timer);
    }
  }, [value, animate]);

  const sizeClasses = {
    sm: 'w-8 h-12 text-xl',
    md: 'w-16 h-24 text-5xl',
    lg: 'w-24 h-36 md:w-40 md:h-60 text-8xl md:text-[13rem]',
    xl: 'w-28 h-44 md:w-52 md:h-80 text-9xl md:text-[16rem]',
  };

  const cardBaseStyle = "absolute inset-0 flex items-center justify-center w-full overflow-hidden backface-hidden";
  
  // Realistic inner shadow and depth effects
  const shadowOverlay = "absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]";
  const highlightOverlay = "absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent h-[2px]";

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${sizeClasses[size]} font-[900] select-none rounded-[10px] md:rounded-[24px] shadow-2xl transition-all duration-500`} 
        style={{ perspective: '1500px' }}
      >
        {/* UPPER CARD (STATIC) - Shows NEXT value */}
        <div className={`absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-[10px] md:rounded-t-[24px] ${theme.cardBg} flex items-end justify-center z-10 border-b border-black/20`}>
          <span className={`leading-none transform translate-y-1/2 ${theme.text}`}>{nextValue}</span>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          <div className={highlightOverlay} />
        </div>

        {/* LOWER CARD (STATIC) - Shows CURRENT value */}
        <div className={`absolute bottom-0 left-0 w-full h-1/2 overflow-hidden rounded-b-[10px] md:rounded-b-[24px] ${theme.cardBg} flex items-start justify-center z-10`}>
          <span className={`leading-none transform -translate-y-1/2 ${theme.text}`}>{currentValue}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className={shadowOverlay} />
        </div>

        {/* FLIPPING CARD */}
        <div 
          className="absolute inset-0 z-20"
          style={{ 
            transformStyle: 'preserve-3d',
            transition: isFlipping ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            transform: isFlipping ? 'rotateX(-180deg)' : 'rotateX(0deg)',
          }}
        >
          {/* TOP FACE (CURRENT) */}
          <div 
            className={`${cardBaseStyle} h-1/2 top-0 items-end rounded-t-[10px] md:rounded-t-[24px] ${theme.cardBg} border-b border-black/20`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className={`leading-none transform translate-y-1/2 ${theme.text}`}>{currentValue}</span>
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isFlipping ? 'opacity-100' : 'opacity-0'}`} />
            <div className={highlightOverlay} />
          </div>

          {/* BOTTOM FACE (NEXT) */}
          <div 
            className={`${cardBaseStyle} h-1/2 top-1/2 items-start rounded-b-[10px] md:rounded-b-[24px] ${theme.cardBg}`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)'
            }}
          >
            <span className={`leading-none transform -translate-y-1/2 ${theme.text}`}>{nextValue}</span>
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isFlipping ? 'opacity-0' : 'opacity-100'}`} />
            <div className={shadowOverlay} />
          </div>
        </div>

        {/* CENTER MECHANICAL LINE (THIN & CRISP) */}
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-black/80 z-50 shadow-[0_1px_2px_rgba(255,255,255,0.1)]" />
      </div>
    </div>
  );
};

export default FlipDigit;
