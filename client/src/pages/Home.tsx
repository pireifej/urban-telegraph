import { useState } from "react";
import { useArticles } from "@/contexts/ArticleContext";
import Navigation from "@/components/Navigation";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Home() {
  const { articles, isLoadingArticles } = useArticles();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('https://urban-telegraph.com/wp-content/themes/twentyeleven/images/headers/wheel.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">Urban-Telegraph</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
              Positively, what's happening
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest Articles</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of articles, reviews, and insights
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoadingArticles ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-24 ml-3" />
                    </div>
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No articles found. Check back soon!</p>
              </div>
            )}
          </div>


          {/* Load More Button */}
          {articles.length > 0 && (
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-load-more"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get the latest urban insights delivered to your inbox
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              data-testid="input-email"
            />
            <Button 
              type="submit" 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Urban-Telegraph</h3>
              <p className="text-primary-foreground/80">
                Your source for urban insights, reviews, and stories from the heart of the city.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Urban Life</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Food Reviews</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Technology</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Culture</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Our Story</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Writers</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 Urban-Telegraph. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
