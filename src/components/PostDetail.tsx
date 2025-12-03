import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
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
  return (
    <div className="animate-fade-in">
      <Button onClick={onBack} variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full">
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
      </Button>

      <article>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8 pb-8 border-b border-border/30">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{post.date}</span></div>
        </div>

        <div className="prose prose-invert max-w-none prose-img:rounded-lg prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Tùy chỉnh hiển thị ảnh
              img: ({node, ...props}) => (
                <span className="block my-8">
                  <img 
                    {...props} 
                    className="rounded-lg shadow-lg border border-border/50 max-w-full h-auto mx-auto" 
                    loading="lazy"
                  />
                  {props.alt && <span className="block text-center text-sm text-muted-foreground mt-2 italic">{props.alt}</span>}
                </span>
              ),
              // Tùy chỉnh hiển thị code block
              code({node, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !className ? (
                  <code className="bg-secondary px-1.5 py-0.5 rounded text-accent font-mono text-sm" {...props}>{children}</code>
                ) : (
                  <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto my-6"><code className={className} {...props}>{children}</code></pre>
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
