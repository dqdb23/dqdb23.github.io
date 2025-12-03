import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Theme {
  name: string;
  bgColor: string;
  textColor: string;
  primaryColor: string;
  accentColor: string;
}

const THEMES: Theme[] = [
  { name: 'Light', bgColor: '#ffffff', textColor: '#333333', primaryColor: '#3b82f6', accentColor: '#ff6b6b' },
  { name: 'Dark', bgColor: '#1a1a1a', textColor: '#e0e0e0', primaryColor: '#60a5fa', accentColor: '#ff8787' },
  { name: 'Cyber', bgColor: '#000000', textColor: '#00ff88', primaryColor: '#00ffff', accentColor: '#ff00ff' },
  { name: 'Ocean', bgColor: '#0c1929', textColor: '#7dd3fc', primaryColor: '#0ea5e9', accentColor: '#f472b6' },
  { name: 'Forest', bgColor: '#0d1f12', textColor: '#86efac', primaryColor: '#22c55e', accentColor: '#fbbf24' },
  { name: 'Sunset', bgColor: '#1c1017', textColor: '#fda4af', primaryColor: '#f43f5e', accentColor: '#fb923c' },
];

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal = ({ isOpen, onClose }: ThemeModalProps) => {
  const [currentTheme, setCurrentTheme] = useState('Dark');

  useEffect(() => {
    const saved = localStorage.getItem('blogTheme');
    if (saved) setCurrentTheme(saved);
  }, []);

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme.name);
    localStorage.setItem('blogTheme', theme.name);
    
    const root = document.documentElement;
    
    // Convert hex to HSL values
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--background', hexToHsl(theme.bgColor));
    root.style.setProperty('--foreground', hexToHsl(theme.textColor));
    root.style.setProperty('--primary', hexToHsl(theme.primaryColor));
    root.style.setProperty('--accent', hexToHsl(theme.accentColor));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="glass-card p-6 max-w-md w-full animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-foreground">Theme</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(theme)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                currentTheme === theme.name
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border/50 hover:border-primary/50'
              }`}
              style={{ backgroundColor: theme.bgColor }}
            >
              <div className="flex gap-2 justify-center mb-3">
                <div 
                  className="w-5 h-5 rounded-full" 
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div 
                  className="w-5 h-5 rounded-full" 
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>
              <p 
                className="text-sm font-medium"
                style={{ color: theme.textColor }}
              >
                {theme.name}
              </p>
            </button>
          ))}
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};
