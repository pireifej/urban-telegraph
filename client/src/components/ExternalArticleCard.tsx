import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ExternalArticle {
  id: number;
  preview: string;
  title: string;
  image: string | null;
  timestamp: string;
}

interface ExternalArticleCardProps {
  article: ExternalArticle;
  onClick?: () => void;
}

export default function ExternalArticleCard({ article, onClick }: ExternalArticleCardProps) {
  const publishedDate = formatDistanceToNow(new Date(article.timestamp), { addSuffix: true });

  return (
    <article 
      className="article-card bg-card rounded-lg shadow-lg overflow-hidden border border-border cursor-pointer" 
      data-testid={`card-external-${article.id}`}
      onClick={onClick}
    >
      {article.image && (
        <img 
          src={`https://www.prayoverus.com:3000/${article.image}`}
          alt={article.title}
          className="w-full h-48 object-cover"
          data-testid="img-featured"
        />
      )}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Badge className="bg-blue-100 text-blue-800" data-testid="text-category">
            <ExternalLink className="mr-1 h-3 w-3" />
            External
          </Badge>
          <span className="text-muted-foreground text-sm ml-3" data-testid="text-published-date">
            {publishedDate}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-accent cursor-pointer" data-testid="text-title">
          {article.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid="text-preview">
          {article.preview}
        </p>
        <div className="flex items-center justify-between">
          <button className="text-accent hover:text-accent/80 font-medium flex items-center" data-testid="button-read-more">
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </button>
          <span className="text-muted-foreground text-sm" data-testid="text-source">
            prayoverus.com
          </span>
        </div>
      </div>
    </article>
  );
}