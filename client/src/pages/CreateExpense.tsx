
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { api } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateExpense() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ title, amount }: { title: string; amount: number }) => {
      const res = await api.expenses.$post({ json: { title, amount } });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-expenses"] });
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title, amount } = Object.fromEntries(formData.entries());
    mutation.mutate({ title: title as string, amount: Number(amount) });
    form.reset();
  }

  return (
    <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" name="title" />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input type="number" id="amount" name="amount" />
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Expense"}
      </Button>
    </form>
  );
}
