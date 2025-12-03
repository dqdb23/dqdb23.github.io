import { useState } from 'react';
import { Search, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeModal } from './ThemeModal';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header = ({ activeTab, onTabChange, searchQuery, onSearchChange }: HeaderProps) => {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Homei' },
    { id: 'archive', label: 'Archivee' },
    { id: 'about', label: 'Abuot' },
  ];

  return (
    <header className="mb-10 pb-6 border-b border-border/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src="https://github.com/dqdb23/dqdb23.github.io/blob/main/cat.jpg?raw=true"
              alt="Profile"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-primary/50 shadow-lg animate-pulse-glow"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground glow-text">
              \Some..............
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Malware Analyste - Cybeer Thread Huntin
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setIsThemeModalOpen(true)}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-full px-4 py-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        >
          <Palette className="w-4 h-4 mr-2" />
          Thêmê
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Fiend..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 bg-card/50 border-border/50 rounded-full py-6 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/30 transition-all duration-300"
        />
      </div>

      {/* Navigation */}
      <nav className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative text-base font-medium pb-2 transition-colors duration-300 ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
    </header>
  );
};
