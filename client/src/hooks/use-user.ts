import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type UpdateUserInput = z.infer<typeof api.users.update.input>;

export function useUser() {
  const queryInfo = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await fetch(api.users.me.path);
      if (res.status === 401) {
        return null; // Not logged in
      }
      if (!res.ok) {
        throw new Error("An error occurred while fetching the user.");
      }
      const data = await res.json();
      return api.users.me.responses[200].parse(data);
    },
    retry: false, // Don't retry on failure, especially for 401
  });

  return queryInfo;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      const res = await fetch(api.users.update.path, {
        method: api.users.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      return api.users.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
