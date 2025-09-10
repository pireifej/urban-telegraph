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
  
  // External articles
  externalArticles: any[];
  isLoadingExternalArticles: boolean;
  refetchExternalArticles: () => void;
  
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

  // Fetch published articles for public view
  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ["/api/articles/published"],
  });

  // Fetch all articles for admin view
  const { data: adminArticles = [], isLoading: isLoadingAdminArticles } = useQuery({
    queryKey: ["/api/articles"],
  });

  // Fetch external articles
  const { 
    data: externalArticles = [], 
    isLoading: isLoadingExternalArticles,
    refetch: refetchExternalArticles 
  } = useQuery({
    queryKey: ["/api/external/articles"],
    queryFn: async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "US/Eastern";
      const response = await apiRequest("POST", "/api/external/articles", { tz: timezone });
      return response.json();
    },
  });

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (article: InsertArticle) => {
      await apiRequest("POST", "/api/articles", article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/published"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/published"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles/published"] });
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
    externalArticles,
    isLoadingExternalArticles,
    refetchExternalArticles,
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
