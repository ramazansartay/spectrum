import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type ListingListResponse = z.infer<typeof api.listings.list.responses[200]>;
type ListingResponse = z.infer<typeof api.listings.get.responses[200]>;
type CreateListingInput = z.infer<typeof api.listings.create.input>;

export function useListings(filters?: {
  search?: string;
  category?: string;
  city?: string;
  sort?: string;
  priceRange?: string;
}) {
  const effectiveFilters = {
    sort: 'recent', // Default sort order
    ...filters,
  };

  const queryParams = new URLSearchParams();
  if (effectiveFilters.search) queryParams.set("search", effectiveFilters.search);
  if (effectiveFilters.category) queryParams.set("category", effectiveFilters.category);
  if (effectiveFilters.city) queryParams.set("city", effectiveFilters.city);
  if (effectiveFilters.sort) queryParams.set("sort", effectiveFilters.sort);
  if (effectiveFilters.priceRange) queryParams.set("priceRange", effectiveFilters.priceRange);

  const queryString = queryParams.toString();
  const url = `${api.listings.list.path}${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: [api.listings.list.path, effectiveFilters],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch listings");
      return api.listings.list.responses[200].parse(await res.json());
    },
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: [api.listings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.listings.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch listing");
      return api.listings.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateListingInput) => {
      const res = await fetch(api.listings.create.path, {
        method: api.listings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to create listing");
      }
      return api.listings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      toast({
        title: "Success",
        description: "Your listing has been created!",
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
