import { useState, useEffect } from "react";
import { useArticles } from "@/contexts/ArticleContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import { Article, InsertArticle, UpdateArticle } from "@shared/schema";

interface ArticleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  article?: Article | null;
}

export default function ArticleEditor({ isOpen, onClose, article }: ArticleEditorProps) {
  const { createArticle, updateArticle, isCreating, isUpdating } = useArticles();
  const [formData, setFormData] = useState<InsertArticle>({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft",
    featuredImage: "",
    readTime: "",
    author: "Urban-Telegraph Team",
  });

  const isEditing = !!article;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt || "",
        category: article.category,
        status: article.status,
        featuredImage: article.featuredImage || "",
        readTime: article.readTime || "",
        author: article.author || "Urban-Telegraph Team",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        status: "draft",
        featuredImage: "",
        readTime: "",
        author: "Urban-Telegraph Team",
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return;
    }

    try {
      if (isEditing && article) {
        await updateArticle(article.id, formData as UpdateArticle);
      } else {
        await createArticle(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  useEffect(() => {
    if (formData.content) {
      const readTime = estimateReadTime(formData.content);
      setFormData(prev => ({ ...prev, readTime }));
    }
  }, [formData.content]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {isEditing ? "Edit Article" : "New Article"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Article Title */}
          <div>
            <Label htmlFor="title">Article Title</Label>
            <Input
              id="title"
              placeholder="Enter article title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="text-lg"
              data-testid="input-title"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban-life">Urban Life</SelectItem>
                  <SelectItem value="food-review">Food Review</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name"
              data-testid="input-author"
            />
          </div>

          {/* Featured Image Upload */}
          <div>
            <Label>Featured Image</Label>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              currentImage={formData.featuredImage}
            />
          </div>

          {/* Article Excerpt */}
          <div>
            <Label htmlFor="excerpt">Article Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={3}
              placeholder="Brief description of the article..."
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              data-testid="textarea-excerpt"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <Label>Article Content</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          </div>

          {/* Read Time Display */}
          {formData.readTime && (
            <div className="text-sm text-muted-foreground">
              Estimated read time: {formData.readTime}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="secondary"
              onClick={() => setFormData(prev => ({ ...prev, status: "draft" }))}
              disabled={isLoading}
              data-testid="button-save-draft"
            >
              Save Draft
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim() || !formData.category}
              data-testid="button-publish"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Article" : "Publish Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
