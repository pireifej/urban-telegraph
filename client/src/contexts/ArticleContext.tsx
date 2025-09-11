import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Article, InsertArticle, UpdateArticle } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ArticleContextType {
  // Public articles
  articles: Article[];
  isLoadingArticles: boolean;
  
  // Admin articles
  adminArticles: Article[];
  isLoadingAdminArticles: boolean;
  
  // Mutations
  createArticle: (article: InsertArticle) => Promise<void>;
  updateArticle: (id: string, article: UpdateArticle) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  
  // Loading states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch articles from external API for public view
  const { data: articlesData, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["external/articles"],
    queryFn: async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "US/Eastern";
      const response = await fetch("https://www.prayoverus.com:3000/getAllBlogArticles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa("admin:password123")}`,
        },
        body: JSON.stringify({ tz: timezone }),
      });
      const data = await response.json();
      return data;
    },
  });

  // Fetch articles from external API for admin view (same data)
  const { data: adminArticlesData, isLoading: isLoadingAdminArticles } = useQuery({
    queryKey: ["external/articles-admin"],
    queryFn: async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "US/Eastern";
      const response = await fetch("https://www.prayoverus.com:3000/getAllBlogArticles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa("admin:password123")}`,
        },
        body: JSON.stringify({ tz: timezone }),
      });
      const data = await response.json();
      return data;
    },
  });

  const articles = articlesData?.result || [];
  const adminArticles = adminArticlesData?.result || [];


  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (article: InsertArticle) => {
      await apiRequest("POST", "/api/articles", article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external/articles"] });
      queryClient.invalidateQueries({ queryKey: ["external/articles-admin"] });
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create article",
        variant: "destructive",
      });
    },
  });

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, article }: { id: string; article: UpdateArticle }) => {
      await apiRequest("PUT", `/api/articles/${id}`, article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external/articles"] });
      queryClient.invalidateQueries({ queryKey: ["external/articles-admin"] });
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update article",
        variant: "destructive",
      });
    },
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external/articles"] });
      queryClient.invalidateQueries({ queryKey: ["external/articles-admin"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  const value: ArticleContextType = {
    articles,
    isLoadingArticles,
    adminArticles,
    isLoadingAdminArticles,
    createArticle: createMutation.mutateAsync,
    updateArticle: (id, article) => updateMutation.mutateAsync({ id, article }),
    deleteArticle: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticleProvider");
  }
  return context;
}
