import React, { useEffect, useRef } from 'react';

const SPOTLIGHT_R = 260;

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

export const RevealLayer: React.FC<RevealLayerProps> = ({ image, cursorX, cursorY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  // Resize canvas to window.innerWidth / window.innerHeight on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        updateMask();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateMask = () => {
    const canvas = canvasRef.current;
    const revealEl = revealRef.current;
    if (!canvas || !revealEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas on every render
    ctx.clearRect(0, 0, width, height);

    if (cursorX > -500 && cursorY > -500) {
      // Build a radial gradient at (cursorX, cursorY) from radius 0 -> SPOTLIGHT_R with stops:
      // 0 -> rgba(255,255,255,1), 0.4 -> 1, 0.6 -> 0.75, 0.75 -> 0.4, 0.88 -> 0.12, 1 -> 0
      const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
      gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      // Fill an arc of radius SPOTLIGHT_R with it
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // canvas.toDataURL() and apply it as maskImage/webkitMaskImage on the reveal div with maskSize: '100% 100%'
      const dataUrl = canvas.toDataURL();
      revealEl.style.maskImage = `url(${dataUrl})`;
      revealEl.style.webkitMaskImage = `url(${dataUrl})`;
      revealEl.style.maskSize = '100% 100%';
      revealEl.style.webkitMaskSize = '100% 100%';
      revealEl.style.maskRepeat = 'no-repeat';
      revealEl.style.webkitMaskRepeat = 'no-repeat';
    } else {
      revealEl.style.maskImage = 'none';
      revealEl.style.webkitMaskImage = 'none';
    }
  };

  // On every render / cursor position change, update canvas & mask
  useEffect(() => {
    updateMask();
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  );
};

export default RevealLayer;
