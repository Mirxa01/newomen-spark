import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AssessmentResult = Tables<"assessment_results">;

export function useAssessmentHistory(userId?: string) {
  return useQuery({
    queryKey: ["assessment-history", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("assessment_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useSubmitAssessmentResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assessmentId,
      userId,
      answers,
      scores,
      resultNarrative,
      savedToMemory,
    }: {
      assessmentId: string;
      userId: string;
      answers: Record<string, unknown>;
      scores: Record<string, number>;
      resultNarrative: string;
      savedToMemory: boolean;
    }) => {
      const { data, error } = await supabase
        .from("assessment_results")
        .insert({
          assessment_id: assessmentId,
          user_id: userId,
          answers: answers as unknown as Tables<"assessment_results">["answers"],
          scores: scores as unknown as Tables<"assessment_results">["scores"],
          result_narrative: resultNarrative,
          saved_to_memory: savedToMemory,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-history"] });
    },
  });
}