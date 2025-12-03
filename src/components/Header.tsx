import { Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  profileImage?: string;
  // 👇 Thêm 2 props mới cho Theme
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export const Header = ({ 
  activeTab, 
  onTabChange, 
  searchQuery, 
  onSearchChange,
  profileImage,
  theme,           // Nhận biến theme
  onThemeToggle    // Nhận hàm đổi theme
}: HeaderProps) => {
  return (
    <header className="mb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
            <img 
              src={profileImage || "https://github.com/shadcn.png"} 
              alt="Profile"
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-background bg-secondary"
              onError={(e) => { e.currentTarget.src = "https://github.com/shadcn.png"; }}
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              \Some..............
            </h1>
            <p className="text-muted-foreground font-mono text-sm md:text-base">
              Malware Analyst - Cyber Threat Hunting
            </p>
          </div>
        </div>

        {/* 👇 NÚT THEME ĐÃ ĐƯỢC SỬA */}
        <button 
          onClick={onThemeToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-all hover:scale-105 active:scale-95 text-sm font-medium border border-border/50 shadow-sm"
        >
          {theme === 'dark' ? (
            <>
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>Light</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-secondary/50 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <nav className="flex gap-2 p-1 bg-secondary/30 rounded-xl w-fit backdrop-blur-sm border border-border/50">
          {['home', 'archive', 'about'].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
