import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Box, RotateCcw } from 'lucide-react';

export default function SpatialCanvas() {
  const canvasRef = useRef(null);
  const [wireframeMode, setWireframeMode] = useState("isometric"); // isometric | parametric | node

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 320;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw Grid Matrix Background
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw 3D Orbiting Wireframe Geometry
      angle += 0.008;

      ctx.save();
      ctx.translate(cx, cy);

      const numPoints = wireframeMode === "parametric" ? 36 : 18;
      const radius = Math.min(w, h) * 0.3;

      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 1;

      const points = [];
      for (let i = 0; i < numPoints; i++) {
        const phi = (i / numPoints) * Math.PI * 2;
        const theta = phi * 2 + angle;
        
        let x = Math.cos(theta) * radius * Math.cos(phi + angle * 0.5);
        let y = Math.sin(theta) * radius * Math.sin(phi + angle * 0.5);
        let z = Math.sin(phi * 3) * 60;

        // Perspective Projection
        const perspective = 300 / (300 + z);
        points.push({ x: x * perspective, y: y * perspective });
      }

      // Connect 3D Mesh Vertices
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 4) % points.length];

        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);

        // Draw glowing joint nodes
        ctx.fillStyle = '#00f5d4';
        ctx.fillRect(p1.x - 2, p1.y - 2, 4, 4);
      }
      ctx.stroke();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [wireframeMode]);

  return (
    <div className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl my-8">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-[9px] uppercase tracking-widest">
        <div className="flex items-center gap-2 text-accent font-bold">
          <Box size={14} />
          <span>Interactive 3D Parametric CAD Mesh Engine</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWireframeMode(wireframeMode === "isometric" ? "parametric" : "isometric")}
            className="px-3 py-1 rounded-full border border-white/10 hover:border-accent text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw size={10} /> Mode: {wireframeMode}
          </button>
        </div>
      </div>

      <div className="relative w-full h-[320px]">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        <div className="absolute bottom-4 left-4 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
          Coordinates: X: 14.52m | Y: 8.90m | Z: 12.04m (Orbiting)
        </div>
      </div>
    </div>
  );
}
