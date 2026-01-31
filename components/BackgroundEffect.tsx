import React, { useEffect, useRef } from 'react';

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const particleCount = 1200;
    const sphereRadius = Math.min(width, height) * 0.35;
    
    // Initialize particles on a sphere surface
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);
      particles.push({ x, y, z, ox: x, oy: y, oz: z });
    }

    let rotation = 0;
    let scrollY = window.scrollY;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleResize();

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.002;

      // Add a slight displacement based on scroll for "assembly/disassembly"
      const dispersion = Math.min(scrollY * 0.1, 150);

      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Sorting particles by Z for basic depth
      const sortedParticles = [...particles].sort((a, b) => {
        // Simple rotation around Y
        const az = a.oz * Math.cos(rotation) - a.ox * Math.sin(rotation);
        const bz = b.oz * Math.cos(rotation) - b.ox * Math.sin(rotation);
        return az - bz;
      });

      sortedParticles.forEach((p) => {
        // Rotate around Y axis
        const x1 = p.ox * Math.cos(rotation) + p.oz * Math.sin(rotation);
        const z1 = -p.ox * Math.sin(rotation) + p.oz * Math.cos(rotation);
        
        // Dispersal effect (sand grain movement)
        const noiseX = (Math.random() - 0.5) * (dispersion * 0.2);
        const noiseY = (Math.random() - 0.5) * (dispersion * 0.2);
        
        const scale = 600 / (600 - z1); // Perspective
        const finalX = x1 * scale + noiseX;
        const finalY = p.oy * scale + noiseY;

        // Opacity based on Z for depth
        const alpha = Math.max(0.05, (z1 + sphereRadius) / (2 * sphereRadius) * 0.4);
        
        ctx.beginPath();
        ctx.arc(finalX, finalY, 1 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`; // Emerald-500
        ctx.fill();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default BackgroundEffect;