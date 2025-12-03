import { ArrowLeft, Calendar, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        Return
      </Button>

      <article>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8 pb-8 border-b border-border/30">
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

        {/* PHẦN HIỂN THỊ NỘI DUNG MARKDOWN */}
        <div className="prose prose-invert max-w-none prose-img:rounded-lg prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !className ? (
                  <code className="bg-secondary px-1.5 py-0.5 rounded text-accent font-mono text-sm" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};
