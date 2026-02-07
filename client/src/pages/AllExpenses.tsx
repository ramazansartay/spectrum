
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Link } from "react-router-dom";

async function getAllExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const data = await res.json();
  return data;
}

export function AllExpenses() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.expenses.map((expense: { id: string; title: string; amount: number }) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">
              <Link to={`/expenses/${expense.id}`}>{expense.title}</Link>
            </TableCell>
            <TableCell>${expense.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
