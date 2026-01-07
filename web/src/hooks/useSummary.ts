import { isSameDay, parseISO, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";
import { GET_SUMMARY } from "../lib/queries";
import { supabase } from "../lib/supabase";
import { Expense, Income } from "../lib/types";

export function useSummary() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GET_SUMMARY,
    variables: {
      expenseFilter: { userId: { eq: userId } },
      incomeFilter: { userId: { eq: userId } }
    },
    pause: !userId
  });

  const summary = useMemo(() => {
    if (!data) return { todayExpense: 0, availableMoney: 0, thisMonthExpense: 0, graphData: [] };

    const expenses = data.expenseCollection.edges.map((e: { node: Expense }) => e.node);
    const incomes = data.incomeCollection.edges.map((e: { node: Income }) => e.node);

    const today = new Date();
    const minMonth = startOfMonth(today);

    const todayExpense = expenses
      .filter((e: Expense) => {
        try {
          return isSameDay(parseISO(e.date), today);
        } catch {
          return false;
        }
      })
      .reduce((acc: number, e: Expense) => acc + e.amount, 0);

    const thisMonthExpense = expenses
      .filter((e: Expense) => {
        try {
          const expenseDate = parseISO(e.date);
          return expenseDate >= minMonth;
        } catch {
          return false;
        }
      })
      .reduce((acc: number, e: Expense) => acc + e.amount, 0);

    const totalIncome = incomes.reduce((acc: number, i: Income) => acc + i.amount, 0);
    const totalExpense = expenses.reduce((acc: number, e: Expense) => acc + e.amount, 0);

    return {
      todayExpense,
      thisMonthExpense,
      availableMoney: totalIncome - totalExpense,
      graphData: [] // TODO: Implement graph data if needed
    };
  }, [data]);

  return { summary, error, isLoading: fetching, mutate: reexecute };
}
