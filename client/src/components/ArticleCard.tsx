import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const readTime = article.readTime || "5 min read";
  const publishedDate = (article as any).timestamp 
    ? formatDistanceToNow(new Date((article as any).timestamp), { addSuffix: true })
    : article.publishedAt 
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : formatDistanceToNow(new Date(article.createdAt || Date.now()), { addSuffix: true });

  const categoryColors: Record<string, string> = {
    "urban-life": "bg-accent text-accent-foreground",
    "food-review": "bg-orange-100 text-orange-800",
    "technology": "bg-blue-100 text-blue-800",
    "environment": "bg-green-100 text-green-800",
    "culture": "bg-purple-100 text-purple-800",
    "business": "bg-gray-100 text-gray-800",
  };

  return (
    <article className="article-card bg-card rounded-lg shadow-lg overflow-hidden border border-border" data-testid={`card-article-${article.id}`}>
      {((article as any).image || article.featuredImage) && (
        <img 
          src={(article as any).image ? `https://www.prayoverus.com:3000/${(article as any).image}` : article.featuredImage}
          alt={article.title}
          className="w-full h-48 object-cover"
          data-testid="img-featured"
        />
      )}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Badge 
            className={categoryColors[article.category] || "bg-accent text-accent-foreground"}
            data-testid="text-category"
          >
            {article.category ? 
              article.category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ') 
              : 'General'
            }
          </Badge>
          <span className="text-muted-foreground text-sm ml-3" data-testid="text-published-date">
            {publishedDate}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-accent cursor-pointer" data-testid="text-title">
          <Link href={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        {((article as any).preview || article.excerpt) && (
          <p className="text-muted-foreground mb-4 line-clamp-3" data-testid="text-excerpt">
            {(article as any).preview || article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Link href={`/article/${article.id}`}>
            <button className="text-accent hover:text-accent/80 font-medium flex items-center" data-testid="button-read-more">
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </Link>
          <span className="text-muted-foreground text-sm" data-testid="text-read-time">
            {readTime}
          </span>
        </div>
      </div>
    </article>
  );
}
