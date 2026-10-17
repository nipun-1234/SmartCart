import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { RevealLayer } from './components/RevealLayer';

const BG_IMAGE_1 = '/images/smart-rock-sneaker.jpg';
const BG_IMAGE_2 = '/images/smart-rock-sneaker.jpg';

export const SPOTLIGHT_R = 260;

export default function LithosHero() {
  const mouse = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smooth = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -999, y: -999 });

  const [activeNav, setActiveNav] = useState('Course');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [revealTheme, setRevealTheme] = useState<'geology' | 'sneaker'>('geology');

  const currentRevealImage = revealTheme === 'sneaker' ? '/images/smart-rock-sneaker.jpg' : BG_IMAGE_2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouse.current.x === -999) {
        smooth.current = { x: e.clientX, y: e.clientY };
      }
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (mouse.current.x === -999) {
          smooth.current = { x: touch.clientX, y: touch.clientY };
        }
        mouse.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    const animate = () => {
      if (mouse.current.x !== -999) {
        smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
        smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
        setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const navItems = ['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour'];

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navigation (fixed, over hero) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Left: Logo & Wordmark */}
        <a href="#hero" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg">
          <svg
            width="26"
            height="26"
            viewBox="0 0 256 256"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic select-none">Lithos</span>
        </a>

        {/* Center pill */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1 shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/20 shadow-sm'
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Right (desktop) */}
        <div className="hidden md:block">
          <button className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:shadow-lg active:scale-95">
            Sign Up
          </button>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden text-white p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 active:scale-90 transition-transform"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-xl flex flex-col justify-center items-center p-6 md:hidden">
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-3 text-center text-lg font-medium rounded-2xl transition-colors ${
                  activeNav === item
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
            <div className="w-full pt-4 border-t border-white/10">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-white text-gray-900 font-semibold py-3 rounded-2xl text-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full overflow-hidden h-screen bg-black select-none"
        style={{ height: '100dvh' }}
      >
        {/* Layer 1: Base image (z-10) */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
          aria-hidden="true"
        />

        {/* Layer 2: Reveal layer (z-30) */}
        <RevealLayer
          image={currentRevealImage}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* Floating Smart Telemetry Card from Reference */}
        <div
          onClick={() => setRevealTheme(revealTheme === 'sneaker' ? 'geology' : 'sneaker')}
          className="hidden md:flex absolute top-[36%] right-[6%] z-[55] bg-[#120e14]/85 backdrop-blur-xl border border-[#E8702A]/35 hover:border-[#E8702A]/70 rounded-2xl p-5 max-w-[320px] flex-col gap-2 cursor-pointer shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(255,77,46,0.2)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.85),0_0_45px_rgba(255,77,46,0.4)] transition-all duration-300 hover:-translate-y-2 group"
          title="Click to toggle AeroCushion Sneaker Spotlight"
        >
          <div className="flex items-center justify-between">
            <span className="text-5xl font-playfair italic text-[#E8702A] leading-none select-none drop-shadow-[0_0_20px_rgba(255,77,46,0.5)]">
              78%
            </span>
            <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none">
              <path
                d="M 5,15 Q 20,2 35,15 T 65,15 T 95,15"
                stroke="#E8702A"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(255,77,46,0.8)]"
              />
            </svg>
          </div>
          <div className="text-[12px] font-bold tracking-[0.12em] uppercase text-white font-sans mt-1">
            NEXT-GEN CUSHIONING ARCHITECTURE
          </div>
          <div className="text-[11px] text-white/70 leading-relaxed font-sans">
            Impact Absorption & Energy Return Dynamics
          </div>
        </div>

        {/* Layer 3: Heading (z-50) */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal drop-shadow-md"
              style={{
                letterSpacing: '-0.05em',
                animationDelay: '0.25s',
              }}
            >
              Layers hold
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal drop-shadow-md"
              style={{
                letterSpacing: '-0.08em',
                animationDelay: '0.42s',
              }}
            >
              tales of time
            </span>
          </h1>
        </div>

        {/* Layer 4: Bottom-left paragraph (z-50) */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed font-normal drop-shadow">
            Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        {/* Layer 5: Bottom-right block (z-50) */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal drop-shadow">
            Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <button className="group inline-flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">
            <span>Start Digging</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
