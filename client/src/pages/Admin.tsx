import { useState } from "react";
import { useArticles } from "@/contexts/ArticleContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ArticleEditor from "@/components/ArticleEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Eye, Trash2, BarChart, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Article } from "@shared/schema";

type AdminView = "articles" | "analytics" | "settings";

export default function Admin() {
  const { adminArticles, isLoadingAdminArticles, deleteArticle, isDeleting } = useArticles();
  const [activeView, setActiveView] = useState<AdminView>("articles");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredArticles = adminArticles.filter((article: any) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.preview || article.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      await deleteArticle(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string | undefined) => {
    if (!category) {
      return <Badge className="bg-accent text-accent-foreground">General</Badge>;
    }

    const categoryColors: Record<string, string> = {
      "urban-life": "bg-accent text-accent-foreground",
      "food-review": "bg-orange-100 text-orange-800",
      "technology": "bg-blue-100 text-blue-800",
      "environment": "bg-green-100 text-green-800",
      "culture": "bg-purple-100 text-purple-800",
      "business": "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={categoryColors[category] || "bg-accent text-accent-foreground"}>
        {category.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your Urban-Telegraph content</p>
            </div>
            <Button 
              onClick={handleNewArticle} 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-new-article"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-lg border border-border p-6">
              <nav className="space-y-2">
                <Button
                  variant={activeView === "articles" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView("articles")}
                  data-testid="button-nav-articles"
                >
                  <Edit className="mr-3 h-4 w-4" />
                  Articles
                </Button>
                <Button
                  variant={activeView === "analytics" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView("analytics")}
                  data-testid="button-nav-analytics"
                >
                  <BarChart className="mr-3 h-4 w-4" />
                  Analytics
                </Button>
                <Button
                  variant={activeView === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveView("settings")}
                  data-testid="button-nav-settings"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeView === "articles" && (
              <div className="bg-card rounded-lg shadow-lg border border-border">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">All Articles</h2>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="search"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                        data-testid="input-search"
                      />
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-48" data-testid="select-category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="urban-life">Urban Life</SelectItem>
                          <SelectItem value="food-review">Food Review</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                          <SelectItem value="culture">Culture</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Articles Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-muted-foreground">Title</th>
                        <th className="text-left py-3 px-6 font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-6 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-6 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoadingAdminArticles ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i}>
                            <td className="py-4 px-6">
                              <div>
                                <Skeleton className="h-5 w-48 mb-2" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Skeleton className="h-6 w-20" />
                            </td>
                            <td className="py-4 px-6">
                              <Skeleton className="h-6 w-16" />
                            </td>
                            <td className="py-4 px-6">
                              <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-muted/50" data-testid={`row-article-${article.id}`}>
                            <td className="py-4 px-6">
                              <div>
                                <div className="font-medium text-foreground" data-testid="text-article-title">
                                  {article.title}
                                </div>
                                <div className="text-sm text-muted-foreground truncate max-w-xs" data-testid="text-article-excerpt">
                                  {article.preview || article.excerpt || "No excerpt available"}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6" data-testid="text-article-category">
                              {getCategoryBadge(article.category)}
                            </td>
                            <td className="py-4 px-6" data-testid="text-article-status">
                              {getStatusBadge(article.status)}
                            </td>
                            <td className="py-4 px-6 text-muted-foreground text-sm" data-testid="text-article-date">
                              {article.timestamp ? 
                                formatDistanceToNow(new Date(article.timestamp), { addSuffix: true }) :
                                formatDistanceToNow(new Date(article.createdAt || Date.now()), { addSuffix: true })
                              }
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditArticle(article)}
                                  className="text-accent hover:text-accent/80"
                                  data-testid={`button-edit-${article.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-500 hover:text-blue-600"
                                  data-testid={`button-view-${article.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteArticle(article.id)}
                                  disabled={isDeleting}
                                  className="text-destructive hover:text-destructive/80"
                                  data-testid={`button-delete-${article.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-16">
                            <p className="text-muted-foreground text-lg">No articles found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeView === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-lg shadow-lg border border-border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Articles</p>
                        <p className="text-2xl font-bold text-foreground">{adminArticles.length}</p>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <Edit className="text-accent h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-lg shadow-lg border border-border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Published</p>
                        <p className="text-2xl font-bold text-foreground">
                          {adminArticles.filter(a => a.status === "published").length}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Eye className="text-green-500 h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-lg shadow-lg border border-border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Drafts</p>
                        <p className="text-2xl font-bold text-foreground">
                          {adminArticles.filter(a => a.status === "draft").length}
                        </p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Edit className="text-yellow-500 h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === "settings" && (
              <div className="bg-card rounded-lg shadow-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Site Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Site Title</label>
                    <Input defaultValue="Urban-Telegraph" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Site Description</label>
                    <textarea 
                      rows={3} 
                      defaultValue="Discover stories, insights, and reviews from the pulse of urban life"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Editor Modal */}
      <ArticleEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        article={editingArticle}
      />
      <Footer />
    </div>
  );
}