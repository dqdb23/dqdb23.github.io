import { useState, useMemo, useEffect } from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { PostDetail } from '@/components/PostDetail';
import { ArchiveList } from '@/components/ArchiveList';
import { AboutPage } from '@/components/AboutPage';
import { Footer } from '@/components/Footer';
import yaml from 'js-yaml';

// --- CẤU HÌNH ---
const CONFIG = {
  githubUser: 'dqdb23',
  githubRepo: 'dqdb23.github.io',
  githubBranch: 'main',
  postsFolder: 'postszz',
};

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // State quản lý dữ liệu
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC FETCH TỪ GITHUB ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // 1. Lấy danh sách file (Recursive)
        const apiUrl = `https://api.github.com/repos/${CONFIG.githubUser}/${CONFIG.githubRepo}/git/trees/${CONFIG.githubBranch}?recursive=1`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('Failed to fetch from GitHub API');
        
        const data = await response.json();
        
        // 2. Lọc file .md trong folder postszz
        const mdFiles = data.tree.filter((item: any) => 
          item.path.startsWith(CONFIG.postsFolder + '/') && 
          item.path.endsWith('.md')
        );

        // 3. Tải nội dung từng file
        const loadedPosts = await Promise.all(mdFiles.map(async (file: any) => {
          const rawUrl = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.githubRepo}/${CONFIG.githubBranch}/${file.path}`;
          const res = await fetch(rawUrl);
          const text = await res.text();
          return parseMarkdown(text, file.path);
        }));

        // 4. Sắp xếp: Mới nhất lên đầu
        loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setPosts(loadedPosts);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // --- HÀM PARSE MARKDOWN & FIX ẢNH ---
  const parseMarkdown = (content: string, filepath: string): Post => {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    let metadata: any = {};
    let markdownContent = content;

    // Tách phần Header (YAML)
    if (match) {
      try {
        metadata = yaml.load(match[1]);
        markdownContent = match[2];
      } catch (e) {
        console.error('Error parsing YAML:', e);
      }
    }

    // --- FIX LINK ẢNH + SPACE (Giống code cũ) ---
    const folderPath = filepath.substring(0, filepath.lastIndexOf('/'));
    const baseImageUrl = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.githubRepo}/${CONFIG.githubBranch}/${folderPath}/`;
    
    markdownContent = markdownContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      if (url.startsWith('http')) return match;
      const cleanUrl = url.startsWith('./') ? url.slice(2) : url;
      const fullUrl = baseImageUrl + cleanUrl;
      // Mã hóa khoảng trắng thành %20
      return `![${alt}](${fullUrl.replace(/\s/g, '%20')})`;
    });

    // --- XỬ LÝ ID & TITLE ---
    const parts = filepath.split('/');
    let id = parts[parts.length - 1].replace('.md', '');
    if (id === 'index' && parts[parts.length - 2] !== CONFIG.postsFolder) {
      id = parts[parts.length - 2];
    }

    // Tạo excerpt (mô tả ngắn cho Card)
    const excerpt = metadata.description || markdownContent.slice(0, 200).replace(/[#*`]/g, '') + '...';

    return {
      id,
      title: metadata.title || id,
      date: metadata.date || new Date().toISOString().split('T')[0],
      excerpt,
      content: markdownContent,
    };
  };

  // --- UI LOGIC ---
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query)
    );
  }, [searchQuery, posts]);

  const handleReadMore = (post: Post) => {
    setSelectedPost(post);
    setActiveTab('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedPost(null);
    setActiveTab('home');
    window.scrollTo(0, 0);
  };

  const handleArchiveSelect = (post: Post) => {
    setSelectedPost(post);
    setActiveTab('detail');
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (activeTab === 'detail' && selectedPost) {
      return <PostDetail post={selectedPost} onBack={handleBack} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="min-h-[50vh]">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground animate-pulse">
                 <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                 Loading posts from GitHub...
               </div>
            ) : error ? (
              <div className="text-center py-20 text-red-400 border border-red-500/20 rounded-lg bg-red-500/10 m-4">
                Error: {error}
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} onReadMore={handleReadMore} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-20">No posts found...</p>
            )}
          </div>
        );
      case 'archive':
        return <ArchiveList posts={posts} onSelectPost={handleArchiveSelect} />;
      case 'about':
        return <AboutPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground">
      <ParticleCanvas />
      
      <div className="content-container relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          <Header 
            activeTab={activeTab === 'detail' ? 'home' : activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if(tab === 'home') setSelectedPost(null);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <main className="mt-8">
            {renderContent()}
          </main>

          <Footer />
        </div>
      </div>

      <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-muted-foreground/20 text-xs font-mono font-bold tracking-widest z-0 select-none">
        <span className="writing-vertical rotate-180">MALWARE_ANALYSIS</span>
        <span className="writing-vertical rotate-180">THREAT_HUNTING</span>
        <span className="writing-vertical rotate-180">CYBER_SECURITY</span>
      </div>
      
      <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 text-muted-foreground/20 text-xs font-mono font-bold tracking-widest z-0 select-none">
        <span className="writing-vertical rotate-180">REVERSE_ENGINEERING</span>
        <span className="writing-vertical rotate-180">APT_TRACKING</span>
        <span className="writing-vertical rotate-180">IOC_RESEARCH</span>
      </div>
    </div>
  );
};

export default Index;
