import { Calendar, ChevronRight } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

interface ArchiveListProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const ArchiveList = ({ posts, onSelectPost }: ArchiveListProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground mb-8">All shi</h2>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group p-4 rounded-lg bg-card/30 border border-border/30 hover:border-primary/50 hover:bg-card/50 cursor-pointer transition-all duration-300 hover:translate-x-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
