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

  // Fetch articles from external API (shared for both public and admin views)
  const { data: articlesData, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["external/articles"],
    queryFn: async () => {
      const response = await fetch("https://shouldcallpaul.replit.app/getAllBlogArticles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`)}`,
        },
        body: JSON.stringify({ tz: "US/Eastern" }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // API returns direct array, not wrapped in result
      return data;
    },
  });

  // Use same data for both public and admin views
  const articles = articlesData || [];
  const adminArticles = articlesData || [];
  const isLoadingAdminArticles = isLoadingArticles;


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
