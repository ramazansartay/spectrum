
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}

export function TotalSpent() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="text-center text-xl font-bold">
      Total Spent: ${data?.total}
    </div>
  );
}
