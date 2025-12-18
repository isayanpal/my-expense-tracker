export type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string | null;
  amount: number;
  description: string | null;
  date: string;
};
