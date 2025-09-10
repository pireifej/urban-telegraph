import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image 
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = content;
      setIsInitialized(true);
    }
  }, [content, isInitialized]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleHeadingChange = (value: string) => {
    execCommand("formatBlock", value);
  };

  const handleLinkInsert = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const handleImageInsert = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  return (
    <div className="border border-border rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-border p-3 bg-muted/30">
        <div className="flex items-center space-x-1 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand("bold")}
            title="Bold"
            data-testid="button-bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand("italic")}
            title="Italic"
            data-testid="button-italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand("underline")}
            title="Underline"
            data-testid="button-underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border"></div>
          
          <Select onValueChange={handleHeadingChange}>
            <SelectTrigger className="w-32" data-testid="select-heading">
              <SelectValue placeholder="Paragraph" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="w-px h-6 bg-border"></div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand("insertUnorderedList")}
            title="Bulleted List"
            data-testid="button-list"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand("insertOrderedList")}
            title="Numbered List"
            data-testid="button-ordered-list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand("formatBlock", "blockquote")}
            title="Quote"
            data-testid="button-quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border"></div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLinkInsert}
            title="Insert Link"
            data-testid="button-link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleImageInsert}
            title="Insert Image"
            data-testid="button-image"
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        className="rich-editor p-4 min-h-[300px] focus:outline-none prose max-w-none"
        contentEditable
        onInput={handleInput}
        data-placeholder="Start writing your article content..."
        data-testid="editor-content"
        style={{ minHeight: "300px" }}
      />
    </div>
  );
}
