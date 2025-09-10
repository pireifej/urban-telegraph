import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="link-home">
                  Urban-Telegraph
                </h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/">
                  <Button 
                    variant={!isAdmin ? "default" : "ghost"}
                    size="sm"
                    data-testid="button-nav-home"
                  >
                    <i className="fas fa-home mr-2"></i>Home
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button 
                    variant={isAdmin ? "default" : "ghost"}
                    size="sm"
                    data-testid="button-nav-admin"
                  >
                    <i className="fas fa-cog mr-2"></i>Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card">
            <Link href="/">
              <Button 
                variant={!isAdmin ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="button-mobile-home"
              >
                <i className="fas fa-home mr-2"></i>Home
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant={isAdmin ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="button-mobile-admin"
              >
                <i className="fas fa-cog mr-2"></i>Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
