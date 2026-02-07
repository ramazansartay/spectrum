
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Expense {
  id: number;
  title: string;
  amount: number;
}

export function ExpenseDetail() {
  const { id } = useParams();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      const res = await fetch(`/api/expenses/${id}`);
      const data = await res.json();
      setExpense(data);
    };
    fetchExpense();
  }, [id]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>{expense.title}</CardTitle>
        <CardDescription>${expense.amount}</CardDescription>
      </CardHeader>
    </Card>
  );
}
