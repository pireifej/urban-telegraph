import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import FullWidthFooter from "@/components/FullWidthFooter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, MessageCircle, Share } from "lucide-react";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { Article } from "@shared/schema";

// Import fallback images
import theaterImage from "@assets/generated_images/Theater_stage_scene_1e95b612.png";
import journalismImage from "@assets/generated_images/Journalism_writing_desk_96f4f60c.png";
import cityImage from "@assets/generated_images/Urban_cityscape_evening_6981b5d6.png";
import conversationImage from "@assets/generated_images/Interview_conversation_scene_909fc0e2.png";
import abstractImage from "@assets/generated_images/Creative_arts_abstract_00e94da6.png";

export default function ArticleDetail() {
  const { id } = useParams();

  // Set page title
  useEffect(() => {
    document.title = "Urban Telegraph";
  }, []);

  const { data: articleData, isLoading, error } = useQuery({
    queryKey: ["external/article", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const response = await fetch("https://shouldcallpaul.replit.app/getBlogArticle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`)}`,
          },
          body: JSON.stringify({ tz: "US/Eastern", id: parseInt(id) }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error !== 0) {
          throw new Error(`API error: ${data.error}`);
        }
        
        return data;
      } catch (fetchError) {
        console.error('Failed to fetch article:', fetchError);
        throw fetchError;
      }
    },
    enabled: !!id,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const article = articleData?.result;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-4 w-64 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const readTime = article.readTime || "5 min read";
  // Function to get precise time since publication
  const getTimeSincePublication = (timestamp: string) => {
    const now = new Date();
    const pubDate = new Date(timestamp);
    
    const years = differenceInYears(now, pubDate);
    const months = differenceInMonths(now, pubDate);
    const days = differenceInDays(now, pubDate);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return 'Today';
    }
  };

  // Use the correct field name: getBlogArticle returns 'date' field, not 'timestamp'
  const publishedDate = article.date 
    ? getTimeSincePublication(article.date)
    : "Recently published";

  // Function to get image URL, same logic as ArticleCard
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-accent hover:text-accent/80 mr-4"
                data-testid="button-back"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </Link>
            {article.category && (
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryColors[article.category] || "bg-accent text-accent-foreground"
                }`}
                data-testid="text-category"
              >
                {article.category.split('-').map((word: string) => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-title">
            {article.title}
          </h1>
          <div className="flex items-center text-muted-foreground text-sm">
            <span data-testid="text-published-date">{publishedDate}</span>
            <span className="mx-2">•</span>
            <span data-testid="text-author">By {article.author || "Urban-Telegraph Team"}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
          <img 
            src={getImageUrl()}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg"
            style={{ objectPosition: 'top' }}
            data-testid="img-featured"
          />
          <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
        </div>

        {/* Article Excerpt */}
        {article.preview && (
          <div className="text-lg text-muted-foreground leading-relaxed mb-8 p-6 bg-muted/30 rounded-lg" data-testid="text-excerpt">
            {article.preview}
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ 
            __html: (article.content || article.preview || "No content available")
              .replace(/<img[^>]*src="img\/[^"]*"[^>]*>/g, '') // Remove broken relative image tags
              .replace(/<p[^>]*>\s*<\/p>/g, '') // Remove empty paragraphs
          }}
          data-testid="content-article"
        />

        {/* Article Actions */}
        <div className="border-t border-border pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-accent"
                data-testid="button-like"
              >
                <Heart className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-accent"
                data-testid="button-comment"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-accent"
              data-testid="button-share"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
      <FullWidthFooter />
    </div>
  );
}
