import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  MoreHorizontal,
  Eye,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Assessment = Tables<"assessments">;

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    icon: "Brain",
    questions_count: 0,
    duration_minutes: 10,
    visibility: "public" as "public" | "authenticated" | "members_only",
    is_active: true,
    category: "",
    tags: [] as string[],
    questions: [] as { question: string; options: string[] }[],
    scoring_logic: {},
    result_narratives: {},
  });
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (err) {
      console.error("Error fetching assessments:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assessments",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const assessmentData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ""),
        questions: formData.questions,
        scoring_logic: formData.scoring_logic,
        result_narratives: formData.result_narratives,
      };

      if (editingAssessment) {
        const { error } = await supabase
          .from("assessments")
          .update(assessmentData)
          .eq("id", editingAssessment.id);

        if (error) throw error;
        toast({ title: "Assessment updated successfully" });
      } else {
        const { error } = await supabase
          .from("assessments")
          .insert([{
            ...assessmentData,
            created_by: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (error) throw error;
        toast({ title: "Assessment created successfully" });
      }

      setIsDialogOpen(false);
      setEditingAssessment(null);
      resetForm();
      fetchAssessments();
    } catch (err) {
      console.error("Error saving assessment:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save assessment",
      });
    }
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || "",
      description: assessment.description || "",
      short_description: assessment.short_description || "",
      icon: assessment.icon || "Brain",
      questions_count: assessment.questions_count || 0,
      duration_minutes: assessment.duration_minutes || 10,
      visibility: assessment.visibility || "public",
      is_active: assessment.is_active ?? true,
      category: assessment.category || "",
      tags: assessment.tags || [],
      questions: Array.isArray(assessment.questions) ? assessment.questions : [],
      scoring_logic: assessment.scoring_logic || {},
      result_narratives: assessment.result_narratives || {},
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (assessmentId: string) => {
    try {
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", assessmentId);

      if (error) throw error;
      
      toast({ title: "Assessment deleted successfully" });
      fetchAssessments();
    } catch (err) {
      console.error("Error deleting assessment:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete assessment",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      short_description: "",
      icon: "Brain",
      questions_count: 0,
      duration_minutes: 10,
      visibility: "public",
      is_active: true,
      category: "",
      tags: [],
      questions: [],
      scoring_logic: {},
      result_narratives: {},
    });
    setTagInput("");
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: "", options: ["", "", "", ""] }],
    });
  };

  const updateQuestion = (index: number, field: "question" | "options", value: string | string[]) => {
    const newQuestions = [...formData.questions];
    if (field === "question") {
      newQuestions[index].question = value as string;
    } else {
      newQuestions[index].options = value as string[];
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public": return "Public";
      case "authenticated": return "Authenticated Users";
      case "members_only": return "Members Only";
      default: return visibility;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Assessments Management</h1>
          <p className="text-muted-foreground">
            Create and manage psychological assessments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAssessment(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAssessment(null);
              resetForm();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAssessment ? "Edit Assessment" : "Create New Assessment"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Assessment Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 10 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="questions_count">Number of Questions</Label>
                  <Input
                    id="questions_count"
                    type="number"
                    value={formData.questions_count}
                    onChange={(e) => setFormData({ ...formData, questions_count: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brain">Brain</SelectItem>
                      <SelectItem value="Heart">Heart</SelectItem>
                      <SelectItem value="Compass">Compass</SelectItem>
                      <SelectItem value="Moon">Moon</SelectItem>
                      <SelectItem value="Star">Star</SelectItem>
                      <SelectItem value="Sparkles">Sparkles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select 
                    value={formData.visibility} 
                    onValueChange={(value) => setFormData({ ...formData, visibility: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="authenticated">Authenticated Users</SelectItem>
                      <SelectItem value="members_only">Members Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add a tag and press Enter"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Questions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                      Add Question
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mt-2 max-h-60 overflow-y-auto">
                    {formData.questions.map((q, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Label>Question {index + 1}</Label>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeQuestion(index)}
                          >
                            Remove
                          </Button>
                        </div>
                        <Input
                          value={q.question}
                          onChange={(e) => updateQuestion(index, "question", e.target.value)}
                          placeholder="Enter question text"
                          className="mb-2"
                        />
                        <Label className="text-sm">Options</Label>
                        {q.options.map((option, optIndex) => (
                          <Input
                            key={optIndex}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, "options", newOptions);
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                            className="mb-1"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAssessment ? "Update Assessment" : "Create Assessment"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        {assessment.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {assessment.short_description}
                      </div>
                    </TableCell>
                    <TableCell>{assessment.category}</TableCell>
                    <TableCell>{assessment.questions_count} questions</TableCell>
                    <TableCell>{assessment.duration_minutes} min</TableCell>
                    <TableCell>{getVisibilityLabel(assessment.visibility || "public")}</TableCell>
                    <TableCell>
                      <Badge variant={assessment.is_active ? "default" : "secondary"}>
                        {assessment.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(assessment)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/assessments/${assessment.id}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(assessment.id)} 
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}