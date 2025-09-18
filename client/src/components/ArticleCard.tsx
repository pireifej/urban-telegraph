import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { Article } from "@shared/schema";

// Import fallback images
import theaterImage from "@assets/generated_images/Theater_stage_scene_1e95b612.png";
import journalismImage from "@assets/generated_images/Journalism_writing_desk_96f4f60c.png";
import cityImage from "@assets/generated_images/Urban_cityscape_evening_6981b5d6.png";
import conversationImage from "@assets/generated_images/Interview_conversation_scene_909fc0e2.png";
import abstractImage from "@assets/generated_images/Creative_arts_abstract_00e94da6.png";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const readTime = article.readTime || "5 min read";
  // Function to get precise time since publication
  const getTimeSincePublication = (timestamp: string) => {
    const now = new Date();
    const pubDate = new Date(timestamp);
    
    const years = differenceInYears(now, pubDate);
    const months = differenceInMonths(now, pubDate);
    const days = differenceInDays(now, pubDate);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else {
      return 'Today';
    }
  };

  const publishedDate = (article as any).timestamp 
    ? getTimeSincePublication((article as any).timestamp)
    : article.publishedAt 
    ? getTimeSincePublication(article.publishedAt)
    : article.createdAt 
    ? getTimeSincePublication(article.createdAt)
    : 'Recently';

  // Function to get image URL, either from external API or fallback
  const getImageUrl = () => {
    // Check if article has an image filename from the external API
    const imageFilename = (article as any).image;
    if (imageFilename) {
      return `https://shouldcallpaul.replit.app/${imageFilename}`;
    }
    
    // Fallback to local images based on article content
    const title = article.title.toLowerCase();
    if (title.includes('theatre') || title.includes('theater') || title.includes('shakespeare') || title.includes('stage') || title.includes('roars')) {
      return theaterImage;
    } else if (title.includes('conversation') || title.includes('interview') || title.includes('lea')) {
      return conversationImage;
    } else if (title.includes('urban') || title.includes('world') || title.includes('city')) {
      return cityImage;
    } else if (title.includes('tips') || title.includes('telegraph') || title.includes('welcome')) {
      return journalismImage;
    } else {
      return abstractImage;
    }
  };

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
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={getImageUrl()}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          data-testid="img-featured"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Badge 
            className={categoryColors[article.category || "general"] || "bg-accent text-accent-foreground"}
            data-testid="text-category"
          >
            {article.category && typeof article.category === 'string' ? 
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
        </div>
      </div>
    </article>
  );
}
