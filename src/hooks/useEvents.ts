import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Event = Tables<"events">;

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useEventById(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      userId,
      isMemberAccess,
      amountPaid,
    }: {
      eventId: string;
      userId: string;
      isMemberAccess: boolean;
      amountPaid: number;
    }) => {
      const { data, error } = await supabase
        .from("event_bookings")
        .insert({
          event_id: eventId,
          user_id: userId,
          status: "pending",
          amount_paid: amountPaid,
          is_member_access: isMemberAccess,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
  });
}

export function useSubmitMembershipLead() {
  return useMutation({
    mutationFn: async ({
      fullName,
      whatsapp,
      eventId,
      source,
    }: {
      fullName: string;
      whatsapp: string;
      eventId?: string;
      source?: string;
    }) => {
      const { data, error } = await supabase
        .from("membership_leads")
        .insert({
          full_name: fullName,
          whatsapp_number: whatsapp,
          event_id: eventId || null,
          source: source || "direct",
          status: "new",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}