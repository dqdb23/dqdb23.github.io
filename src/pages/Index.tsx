import { useState, useMemo, useEffect } from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { PostDetail } from '@/components/PostDetail';
import { ArchiveList } from '@/components/ArchiveList';
import { AboutPage } from '@/components/AboutPage';
import { Footer } from '@/components/Footer';

// --- CẤU HÌNH ---
const CONFIG = {
  githubUser: 'dqdb23',
  githubRepo: 'dqdb23.github.io',
  githubBranch: 'main',
  postsFolder: 'postszz',
  profileImage: '/cat.jpg' // Ảnh này phải nằm trong thư mục public
};

interface Post { id: string; title: string; date: string; excerpt: string; content: string; }

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // THEME LOGIC
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light';
    if (saved) setTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // FETCH DATA
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://api.github.com/repos/${CONFIG.githubUser}/${CONFIG.githubRepo}/git/trees/${CONFIG.githubBranch}?recursive=1`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('GitHub API Error');
        const data = await response.json();
        
        const mdFiles = data.tree.filter((item: any) => 
          item.path && item.path.startsWith(CONFIG.postsFolder + '/') && item.path.endsWith('.md')
        );

        const loadedPosts = await Promise.all(mdFiles.map(async (file: any) => {
          const rawUrl = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.githubRepo}/${CONFIG.githubBranch}/${file.path}`;
          const res = await fetch(rawUrl);
          const text = await res.text();
          return parseMarkdown(text, file.path);
        }));

        loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(loadedPosts);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally { setLoading(false); }
    };
    fetchPosts();
  }, []);

  // --- HÀM TỰ XỬ LÝ MARKDOWN (KHÔNG DÙNG THƯ VIỆN ĐỂ TRÁNH LỖI) ---
  const parseMarkdown = (content: string, filepath: string): Post => {
    let metadata: any = {};
    let markdownContent = content;

    try {
      // 1. Tự tách Header bằng Regex (An toàn tuyệt đối)
      const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = content.match(frontMatterRegex);
      
      if (match) {
        const metaStr = match[1];
        markdownContent = match[2];

        // 2. Đọc từng dòng key: value
        metaStr.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let val = line.slice(colonIndex + 1).trim();
            // Xóa dấu ngoặc kép nếu có
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            metadata[key] = val;
          }
        });
      }
    } catch (e) { console.warn("Parse error", e); }

    // 3. Xử lý Link ảnh
    const folderPath = filepath.substring(0, filepath.lastIndexOf('/'));
    const baseImageUrl = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.githubRepo}/${CONFIG.githubBranch}/${folderPath}/`;
    
    markdownContent = markdownContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      if (url.startsWith('http')) return match;
      const cleanUrl = url.startsWith('./') ? url.slice(2) : url;
      let fullUrl = baseImageUrl + cleanUrl;
      fullUrl = fullUrl.replace(/\s/g, '%20');
      return `![${alt}](${fullUrl})`;
    });

    // 4. Xử lý ID
    const parts = filepath.split('/');
    let id = parts[parts.length - 1].replace('.md', '');
    if (id === 'index' && parts[parts.length - 2] !== CONFIG.postsFolder) id = parts[parts.length - 2];

    return {
      id,
      title: metadata.title || id,
      date: metadata.date || new Date().toISOString().split('T')[0],
      excerpt: metadata.description || markdownContent.slice(0, 150) + '...',
      content: markdownContent,
    };
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  }, [searchQuery, posts]);

  const renderContent = () => {
    if (activeTab === 'detail' && selectedPost) return <PostDetail post={selectedPost} onBack={() => {setSelectedPost(null); setActiveTab('home')}} />;
    if (activeTab === 'archive') return <ArchiveList posts={posts} onSelectPost={(p) => {setSelectedPost(p); setActiveTab('detail')}} />;
    if (activeTab === 'about') return <AboutPage />;
    
    return (
      <div className="min-h-[50vh]">
        {loading ? <div className="text-center py-20 animate-pulse">Loading posts...</div> :
         error ? <div className="text-center py-20 text-red-400">Error: {error}</div> :
         filteredPosts.map(p => <PostCard key={p.id} post={p} onReadMore={(post) => {setSelectedPost(post); setActiveTab('detail')}} />)}
      </div>
    );
  };

return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground transition-colors duration-300">
      
      {/* 👇 CHỈ HIỆN HIỆU ỨNG HẠT KHI Ở CHẾ ĐỘ DARK */}
      {theme === 'dark' && <ParticleCanvas />}
      
      <div className="content-container relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          <Header 
            activeTab={activeTab === 'detail' ? 'home' : activeTab}
            onTabChange={(t) => { setActiveTab(t); if(t==='home') setSelectedPost(null); }}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            profileImage={CONFIG.profileImage}
            theme={theme} onThemeToggle={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
          />
          <main className="mt-8">{renderContent()}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
