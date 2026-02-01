import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Upload, 
  Wand2, 
  Link as LinkIcon, 
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const QUICK_PROMPTS = [
  "A mystical cosmic event gathering with ethereal purple and pink nebula backdrop, people connecting in sacred space",
  "An intimate transformation circle with soft candlelight, healing energy visualization, warm golden tones",
  "A vibrant workshop scene with creative energy, colorful abstract art elements, inspiring atmosphere",
  "A serene meditation retreat setting with zen garden, flowing water, peaceful morning light"
];

interface EventImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function EventImageUploader({ value, onChange }: EventImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("url");
  const [urlInput, setUrlInput] = useState(value || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setIsOpen(false);
      toast({ title: "Image URL saved" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB"
      });
      return;
    }

    // For now, convert to base64 for preview
    // In production, you'd upload to storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      // Note: For production, upload to Supabase storage and use the returned URL
      onChange(dataUrl);
      toast({ title: "Image uploaded" });
    };
    reader.readAsDataURL(file);
  };

  const generateWithAI = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("image-studio", {
        body: { 
          action: "generate", 
          prompt: prompt || "A beautiful event gathering with mystical cosmic atmosphere, purple and pink gradients, ethereal lighting" 
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setPreviewUrl(data.imageUrl);
        onChange(data.imageUrl);
        toast({ 
          title: "✨ Image generated!",
          description: "Your event image has been created"
        });
      }
    } catch (err: any) {
      console.error("AI generation error:", err);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: err.message || "Failed to generate image"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Event Image</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL"
          className="flex-1"
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="gap-2">
              <Wand2 className="h-4 w-4" />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Add Event Image
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="url" className="gap-1">
                  <LinkIcon className="h-3.5 w-3.5" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-1">
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {urlInput && (
                  <div className="rounded-lg overflow-hidden border">
                    <img 
                      src={urlInput} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                      onError={() => toast({ variant: "destructive", title: "Invalid image URL" })}
                    />
                  </div>
                )}
                <Button onClick={handleUrlSubmit} className="w-full">
                  Use This Image
                </Button>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {previewUrl && activeTab === "upload" && (
                  <div className="rounded-lg overflow-hidden border">
                    <img 
                      src={previewUrl} 
                      alt="Uploaded preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <div>
                  <Label>Quick Prompts</Label>
                  <div className="grid gap-2 mt-2">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <Button
                        key={i}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto py-2 px-3 text-left justify-start text-xs"
                        onClick={() => generateWithAI(prompt)}
                        disabled={isGenerating}
                      >
                        <Sparkles className="h-3 w-3 mr-2 shrink-0 text-primary" />
                        <span className="line-clamp-1">{prompt.slice(0, 60)}...</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label htmlFor="custom-ai-prompt">Custom Description</Label>
                  <Textarea
                    id="custom-ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the event image you want to create..."
                    rows={3}
                    className="mt-2"
                  />
                  <Button 
                    onClick={() => generateWithAI(aiPrompt)}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full mt-3 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>

                {previewUrl && activeTab === "ai" && (
                  <div className="rounded-lg overflow-hidden border">
                    <img 
                      src={previewUrl} 
                      alt="AI generated preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Image Preview */}
      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border w-32 h-20">
          <img 
            src={value} 
            alt="Event image" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
