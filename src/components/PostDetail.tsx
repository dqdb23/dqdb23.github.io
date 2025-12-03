import { ArrowLeft, Calendar, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export const PostDetail = ({ post, onBack }: PostDetailProps) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="animate-fade-in">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Returng
      </Button>

      <article>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
              isLiked 
                ? 'text-accent bg-accent/10' 
                : 'hover:text-accent hover:bg-accent/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:text-primary hover:bg-primary/10 transition-all duration-300">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <div 
            className="text-secondary-foreground leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </div>
      </article>
    </div>
  );
};

function formatContent(content: string): string {
  // Simple markdown-like formatting
  return content
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-foreground mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-foreground mt-8 mb-4">$1</h1>')
    .replace(/`([^`]+)`/g, '<code class="bg-secondary px-2 py-1 rounded text-accent font-mono text-sm">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br>')
    .replace(/^\|(.+)\|$/gm, (match, content) => {
      const cells = content.split('|').map((c: string) => `<td class="border border-border px-3 py-2">${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    });
}
