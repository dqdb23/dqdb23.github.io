import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: 'sand' | 'spark' | 'ember';
}

const COLORS = {
  sand: ['#f4a460', '#daa520', '#cd853f', '#d2691e', '#8b4513'],
  spark: ['#60a5fa', '#3b82f6', '#2563eb', '#00d4ff', '#7dd3fc'],
  ember: ['#f87171', '#ef4444', '#dc2626', '#ff6b6b', '#fca5a5'],
};

export const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isDrawing: false });
  const animationRef = useRef<number>();

  const createParticle = useCallback((x: number, y: number, type: 'sand' | 'spark' | 'ember' = 'sand'): Particle => {
    const colors = COLORS[type];
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3 + 2,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      type,
    };
  }, []);

  const spawnParticles = useCallback((x: number, y: number, count: number = 5) => {
    const types: ('sand' | 'spark' | 'ember')[] = ['sand', 'spark', 'ember'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      particlesRef.current.push(createParticle(x + offsetX, y + offsetY, type));
    }
    
    // Limit particles
    if (particlesRef.current.length > 2000) {
      particlesRef.current = particlesRef.current.slice(-1500);
    }
  }, [createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Spawn initial ambient particles
    const spawnAmbient = () => {
      const margin = 200;
      const leftX = Math.random() * margin;
      const rightX = canvas.width - Math.random() * margin;
      const y = Math.random() * 50;
      
      if (Math.random() > 0.5) {
        spawnParticles(leftX, y, 1);
      } else {
        spawnParticles(rightX, y, 1);
      }
    };

    const ambientInterval = setInterval(spawnAmbient, 100);

    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life++;
        
        // Apply gravity
        particle.vy += 0.1;
        
        // Apply wind effect
        particle.vx += (Math.random() - 0.5) * 0.1;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.5;
        }

        // Ground collision - particles settle at bottom
        if (particle.y > canvas.height - 10) {
          particle.y = canvas.height - 10;
          particle.vy *= -0.3;
          particle.vx *= 0.8;
        }

        // Calculate opacity based on life
        const lifeRatio = 1 - (particle.life / particle.maxLife);
        
        if (lifeRatio <= 0) return false;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(lifeRatio * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Add glow effect for spark particles
        if (particle.type === 'spark') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, particle.color + '40');
          gradient.addColorStop(1, particle.color + '00');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(ambientInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [spawnParticles]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current = { x, y, isDrawing: mouseRef.current.isDrawing };

    if (mouseRef.current.isDrawing) {
      spawnParticles(x, y, 8);
    }
  }, [spawnParticles]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.isDrawing = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      spawnParticles(e.clientX - rect.left, e.clientY - rect.top, 15);
    }
  }, [spawnParticles]);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDrawing = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    spawnParticles(x, y, 5);
  }, [spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchStart={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const touch = e.touches[0];
          spawnParticles(touch.clientX - rect.left, touch.clientY - rect.top, 10);
        }
      }}
    />
  );
};
