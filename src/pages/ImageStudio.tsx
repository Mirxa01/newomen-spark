import { useState, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Wand2, 
  Upload, 
  Sparkles, 
  Download, 
  RefreshCw,
  Image as ImageIcon,
  Palette,
  Sun,
  Moon,
  Stars,
  Zap,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PresetPrompt {
  icon: LucideIcon;
  label: string;
  prompt: string;
}

interface GenerationPrompt {
  label: string;
  prompt: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    icon: Sparkles,
    label: "Mystical Glow",
    prompt: "Add a mystical ethereal glow with soft purple and pink light rays emanating from the subject"
  },
  {
    icon: Stars,
    label: "Cosmic Energy",
    prompt: "Transform with cosmic energy, add subtle star particles and nebula-like gradients in the background"
  },
  {
    icon: Sun,
    label: "Golden Hour",
    prompt: "Apply warm golden hour lighting with soft lens flare and dreamy atmosphere"
  },
  {
    icon: Moon,
    label: "Lunar Magic",
    prompt: "Add moonlit mystical atmosphere with silver highlights and subtle celestial elements"
  },
  {
    icon: Palette,
    label: "Aura Colors",
    prompt: "Reveal the subject's aura with colorful energy field visualization in purple, teal, and gold tones"
  },
  {
    icon: Zap,
    label: "Energy Boost",
    prompt: "Add dynamic energy effects with electric highlights and vibrant color enhancement"
  },
  {
    icon: Heart,
    label: "Self-Love Glow",
    prompt: "Create a warm, loving atmosphere with soft rose-gold tones and gentle heart-shaped bokeh"
  }
];

const GENERATION_PROMPTS = [
  {
    label: "Cosmic Avatar",
    prompt: "A mystical cosmic avatar with swirling galaxies for hair, glowing purple and pink eyes, ethereal and divine presence, ultra high resolution"
  },
  {
    label: "Sacred Geometry",
    prompt: "Intricate sacred geometry mandala with flower of life, Metatron's cube, golden ratio spirals, purple and teal gradient background, mystical and meditative"
  },
  {
    label: "Spirit Animal",
    prompt: "A majestic spirit animal emerging from cosmic mist, bioluminescent features, aurora borealis colors, magical and protective presence"
  },
  {
    label: "Chakra Garden",
    prompt: "A beautiful ethereal garden with seven chakra flowers glowing in their respective colors, mystical forest backdrop, healing energy"
  },
  {
    label: "Transformation Portal",
    prompt: "A magical transformation portal with swirling energy, stepping into a new dimension, golden and purple light, spiritual awakening"
  }
];

export default function ImageStudio() {
  const [activeTab, setActiveTab] = useState("edit");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (prompt: string, action: "edit" | "generate") => {
    setIsProcessing(true);
    
    try {
      const payload: any = { action, prompt };
      
      if (action === "edit" && uploadedImage) {
        payload.imageUrl = uploadedImage;
      }

      const { data, error } = await supabase.functions.invoke("image-studio", {
        body: payload
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "✨ Image created!",
          description: data.message || "Your magical transformation is complete"
        });
      } else {
        throw new Error("No image returned");
      }
    } catch (err: any) {
      console.error("Image processing error:", err);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: err.message || "Failed to process image. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetClick = (prompt: string) => {
    if (activeTab === "edit" && !uploadedImage) {
      toast({
        variant: "destructive",
        title: "No image uploaded",
        description: "Please upload an image first to apply effects"
      });
      return;
    }
    processImage(prompt, activeTab === "edit" ? "edit" : "generate");
  };

  const handleCustomPrompt = () => {
    if (!customPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty prompt",
        description: "Please enter a description for your image"
      });
      return;
    }
    if (activeTab === "edit" && !uploadedImage) {
      toast({
        variant: "destructive",
        title: "No image uploaded",
        description: "Please upload an image first to apply effects"
      });
      return;
    }
    processImage(customPrompt, activeTab === "edit" ? "edit" : "generate");
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `newme-creation-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetStudio = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setCustomPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Wand2 className="h-4 w-4" />
            NewMe AI Image Studio
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Transform Your <span className="text-primary">Visual Story</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create stunning, mystical imagery that reflects your inner journey. 
            Upload your photos for magical transformations or generate entirely new visions.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="edit" className="gap-2">
              <Palette className="h-4 w-4" />
              Edit Photo
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate New
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Panel - Canvas */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  {activeTab === "edit" ? "Your Canvas" : "Generated Image"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "edit" 
                    ? "Upload a photo to begin your transformation" 
                    : "Your AI-generated creation will appear here"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TabsContent value="edit" className="mt-0">
                  {!uploadedImage ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <Upload className="h-12 w-12 mx-auto text-primary/50 mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground/70">
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
                  ) : (
                    <div className="space-y-4">
                      <AspectRatio ratio={1} className="bg-muted rounded-xl overflow-hidden">
                        <img 
                          src={generatedImage || uploadedImage} 
                          alt="Your image" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={resetStudio}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Image
                        </Button>
                        {generatedImage && (
                          <Button variant="outline" size="sm" onClick={downloadImage}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="generate" className="mt-0">
                  {!generatedImage ? (
                    <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center">
                      <Sparkles className="h-12 w-12 mx-auto text-primary/50 mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Your creation will appear here
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        Select a preset or enter your own prompt
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AspectRatio ratio={1} className="bg-muted rounded-xl overflow-hidden">
                        <img 
                          src={generatedImage} 
                          alt="Generated image" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={resetStudio}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Start Over
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadImage}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-primary font-medium">Creating magic...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Panel - Controls */}
            <div className="space-y-6">
              {/* Preset Prompts */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wand2 className="h-5 w-5 text-primary" />
                    {activeTab === "edit" ? "Transformation Effects" : "Creation Ideas"}
                  </CardTitle>
                  <CardDescription>
                    Click any preset to instantly apply
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {activeTab === "edit" 
                      ? PRESET_PROMPTS.map((preset, index) => {
                          const IconComp = preset.icon;
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              className="h-auto py-3 px-4 justify-start gap-3 hover:bg-primary/10 hover:border-primary/50"
                              onClick={() => handlePresetClick(preset.prompt)}
                              disabled={isProcessing}
                            >
                              <IconComp className="h-4 w-4 text-primary shrink-0" />
                              <span className="text-sm">{preset.label}</span>
                            </Button>
                          );
                        })
                      : GENERATION_PROMPTS.map((preset, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-auto py-3 px-4 justify-start gap-3 hover:bg-primary/10 hover:border-primary/50"
                            onClick={() => handlePresetClick(preset.prompt)}
                            disabled={isProcessing}
                          >
                            <Sparkles className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm">{preset.label}</span>
                          </Button>
                        ))
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Custom Prompt */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Custom Vision
                  </CardTitle>
                  <CardDescription>
                    Describe your unique transformation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom-prompt" className="sr-only">
                      Custom prompt
                    </Label>
                    <Textarea
                      id="custom-prompt"
                      placeholder={activeTab === "edit" 
                        ? "Describe how you want to transform your image... e.g., 'Add a celestial crown made of stars and moonlight'" 
                        : "Describe the image you want to create... e.g., 'A mystical phoenix rising from cosmic flames with purple and gold feathers'"}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <Button 
                    onClick={handleCustomPrompt} 
                    disabled={isProcessing || !customPrompt.trim()}
                    className="w-full gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        {activeTab === "edit" ? "Apply Transformation" : "Generate Image"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="glass-card bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">Pro Tips</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Be specific about colors, lighting, and mood</li>
                        <li>• Mention "ultra high resolution" for better quality</li>
                        <li>• Combine multiple effects in your description</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
