import { useState, useMemo, useEffect } from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { PostDetail } from '@/components/PostDetail';
import { ArchiveList } from '@/components/ArchiveList';
import { AboutPage } from '@/components/AboutPage';
import { Footer } from '@/components/Footer';
import { load } from 'js-yaml';

// --- CẤU HÌNH ---
const CONFIG = {
  githubUser: 'dqdb23',
  githubRepo: 'dqdb23.github.io',
  githubBranch: 'main',
  postsFolder: 'postszz',
  profileImage: '/cat.jpg'
};

interface Post { id: string; title: string; date: string; excerpt: string; content: string; }

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // STATE THEME
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // LOGIC ĐỔI THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
          item.path.startsWith(CONFIG.postsFolder + '/') && item.path.endsWith('.md')
        );

        const loadedPosts = await Promise.all(mdFiles.map(async (file: any) => {
          const rawUrl = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.githubRepo}/${CONFIG.githubBranch}/${file.path}`;
          const res = await fetch(rawUrl);
          const text = await res.text();
          return parseMarkdown(text, file.path);
        }));

        loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(loadedPosts);
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };
    fetchPosts();
  }, []);

  const parseMarkdown = (content: string, filepath: string): Post => {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    let metadata: any = {};
    let markdownContent = content;

    if (match) { try { metadata = load(match[1]); markdownContent = match[2]; } catch (e) {} }

    const folderPath = filepath.substring(0, filepath.lastIndexOf('/'));
    const baseImageUrl = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.githubRepo}/${CONFIG.githubBranch}/${folderPath}/`;
    
    markdownContent = markdownContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      if (url.startsWith('http')) return match;
      const cleanUrl = url.startsWith('./') ? url.slice(2) : url;
      let fullUrl = baseImageUrl + cleanUrl;
      fullUrl = fullUrl.replace(/\s/g, '%20');
      return `![${alt}](${fullUrl})`;
    });

    const parts = filepath.split('/');
    let id = parts[parts.length - 1].replace('.md', '');
    if (id === 'index' && parts[parts.length - 2] !== CONFIG.postsFolder) id = parts[parts.length - 2];

    const excerpt = metadata.description || markdownContent.slice(0, 200).replace(/[#*`]/g, '') + '...';

    return {
      id, title: metadata.title || id, date: metadata.date || new Date().toISOString().split('T')[0], excerpt, content: markdownContent,
    };
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(p => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query));
  }, [searchQuery, posts]);

  const handleReadMore = (post: Post) => { setSelectedPost(post); setActiveTab('detail'); window.scrollTo(0,0); };
  const handleBack = () => { setSelectedPost(null); setActiveTab('home'); window.scrollTo(0,0); };
  const handleArchiveSelect = (post: Post) => { setSelectedPost(post); setActiveTab('detail'); window.scrollTo(0,0); };

  const renderContent = () => {
    if (activeTab === 'detail' && selectedPost) return <PostDetail post={selectedPost} onBack={handleBack} />;
    if (activeTab === 'archive') return <ArchiveList posts={posts} onSelectPost={handleArchiveSelect} />;
    if (activeTab === 'about') return <AboutPage />;
    
    return (
      <div className="min-h-[50vh]">
        {loading ? <div className="text-center py-20 animate-pulse">Loading posts...</div> :
         error ? <div className="text-center py-20 text-red-400">Error: {error}</div> :
         filteredPosts.length > 0 ? filteredPosts.map(p => <PostCard key={p.id} post={p} onReadMore={handleReadMore} />) :
         <p className="text-center py-20 text-muted-foreground">No posts found.</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground">
      <ParticleCanvas />
      <div className="content-container relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          <Header 
            activeTab={activeTab === 'detail' ? 'home' : activeTab}
            onTabChange={(t) => { setActiveTab(t); if(t==='home') setSelectedPost(null); }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            profileImage={CONFIG.profileImage}
            
            // 👇 TRUYỀN DỮ LIỆU THEME VÀO ĐÂY
            theme={theme}
            onThemeToggle={toggleTheme}
          />
          <main className="mt-8">{renderContent()}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
