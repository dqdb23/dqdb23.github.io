import { Calendar, ArrowRight, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

interface PostCardProps {
  post: Post;
  onReadMore: (post: Post) => void;
}

export const PostCard = ({ post, onReadMore }: PostCardProps) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50));
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <article className="mb-10 pb-8 border-b border-border/30 animate-fade-in">
      <h2 
        onClick={() => onReadMore(post)}
        className="text-xl md:text-2xl font-semibold text-foreground hover:text-primary cursor-pointer transition-colors duration-300 mb-3"
      >
        {post.title}
      </h2>
      
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
        <Calendar className="w-4 h-4" />
        <span>{post.date}</span>
      </div>

      <p className="text-secondary-foreground leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onReadMore(post)}
          className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all duration-300 group"
        >
          Read more
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
              isLiked 
                ? 'text-accent bg-accent/10' 
                : 'text-muted-foreground hover:text-accent hover:bg-accent/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
