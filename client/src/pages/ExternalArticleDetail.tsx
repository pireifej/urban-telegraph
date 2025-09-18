import { useParams } from "wouter";
import { useArticles } from "@/contexts/ArticleContext";
import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import FullWidthFooter from "@/components/FullWidthFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";

export default function ExternalArticleDetail() {
  const { id } = useParams();
  const { externalArticles } = useArticles();

  // Set page title
  useEffect(() => {
    document.title = "Urban Telegraph";
  }, []);

  const article = externalArticles.find(a => a.id === parseInt(id || "0"));

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The external article you're looking for doesn't exist or is no longer available.
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

  const publishedDate = getTimeSincePublication(article.timestamp);

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
            <Badge className="bg-blue-100 text-blue-800" data-testid="text-category">
              <ExternalLink className="mr-1 h-3 w-3" />
              External Article
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-title">
            {article.title}
          </h1>
          <div className="flex items-center text-muted-foreground text-sm">
            <span data-testid="text-published-date">{publishedDate}</span>
            <span className="mx-2">•</span>
            <span data-testid="text-source">Source: prayoverus.com</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <img 
            src={`https://www.prayoverus.com:3000/${article.image}`}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
            data-testid="img-featured"
          />
        )}

        {/* Article Preview */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-lg leading-relaxed mb-8" data-testid="text-preview">
            {article.preview}
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">
              This is a preview of an external article. To read the full content, visit the original source.
            </p>
            <Button 
              asChild
              className="bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="button-visit-source"
            >
              <a 
                href="https://www.prayoverus.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit prayoverus.com
              </a>
            </Button>
          </div>
        </div>

        {/* Related External Articles */}
        {externalArticles.length > 1 && (
          <div className="border-t border-border pt-8 mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">More External Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {externalArticles
                .filter(a => a.id !== article.id)
                .slice(0, 4)
                .map((relatedArticle) => (
                  <Link key={relatedArticle.id} href={`/external/${relatedArticle.id}`}>
                    <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedArticle.preview}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
      <FullWidthFooter />
    </div>
  );
}