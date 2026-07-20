import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundscapeToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const toggleSoundscape = () => {
    if (isPlaying) {
      if (gainRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1);
        setTimeout(() => {
          oscRef.current?.stop();
          audioCtxRef.current?.close();
          setIsPlaying(false);
        }, 1000);
      }
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 432 Hz Healing Resonance Sine Wave
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 2); // Very soft ambient backdrop volume

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;

        setIsPlaying(true);
      } catch (_err) {
        console.warn("Audio Context blocked by browser auto-play policy.");
      }
    }
  };

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggleSoundscape}
      className={`px-3 py-1.5 rounded-full border text-[9px] font-mono uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${
        isPlaying 
          ? 'bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(0,245,212,0.3)] animate-pulse'
          : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
      }`}
    >
      {isPlaying ? <Volume2 size={10} className="text-accent" /> : <VolumeX size={10} />}
      <span>{isPlaying ? "Ambient 432Hz Soundscape: ON" : "Ambient Soundscape"}</span>
    </button>
  );
}
