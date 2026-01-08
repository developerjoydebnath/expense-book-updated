// import { useEffect, useState } from "react";
// import { useMutation, useQuery } from "urql";
// import { ADD_EXPENSE, DELETE_EXPENSE, EDIT_EXPENSE, GET_EXPENSES } from "../lib/queries";
// import { supabase } from "../lib/supabase";
// import { Expense } from "../lib/types";

// export function useExpenses(dateFilter?: string, limit?: number, orderBy?: Record<string, string>[]) {
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setUserId(user?.id || null);
//     });
//   }, []);

//   const [{ data, fetching, error }, reexecute] = useQuery({
//     query: GET_EXPENSES,
//     variables: {
//       filter: {
//         userId: { eq: userId },
//         ...(dateFilter ? { date: { eq: dateFilter } } : {})
//       },
//       orderBy,
//       first: limit
//     },
//     pause: !userId
//   });

//   return { 
//     expenses: data?.expenseCollection?.edges.map((e: { node: Expense }) => e.node) || [], 
//     error, 
//     isLoading: fetching, 
//     mutate: reexecute 
//   };
// }

// export function useAddExpense() {
//   const [res, executeMutation] = useMutation(ADD_EXPENSE);
//   return { executeMutation, ...res };
// }

// export function useEditExpense() {
//   const [res, executeMutation] = useMutation(EDIT_EXPENSE);
//   return { executeMutation, ...res };
// }

// export function useDeleteExpense() {
//   const [res, executeMutation] = useMutation(DELETE_EXPENSE);
//   return { executeMutation, ...res };
// }


// hooks/useExpenses.ts
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { ADD_EXPENSE, DELETE_EXPENSE, EDIT_EXPENSE, GET_EXPENSES } from "../lib/queries";
import { supabase } from "../lib/supabase";
import { Expense } from "../lib/types";

export function useExpenses(dateFilter?: string, limit?: number, orderBy?: Record<string, string>[]) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GET_EXPENSES,
    variables: {
      filter: {
        userId: { eq: userId },
        ...(dateFilter ? { date: { eq: dateFilter } } : {})
      },
      orderBy,
      first: limit
    },
    pause: !userId,
    // CRITICAL: Add requestPolicy to ensure fresh data
    requestPolicy: 'cache-and-network',
  });

  // Enhanced mutate function
  const mutate = () => {
    return reexecute({
      requestPolicy: 'network-only', // Force network request
    });
  };

  return { 
    expenses: data?.expenseCollection?.edges.map((e: { node: Expense }) => e.node) || [], 
    error, 
    isLoading: fetching, 
    mutate,
    rawData: data // For debugging
  };
}

export function useAddExpense() {
  const [res, executeMutation] = useMutation(ADD_EXPENSE);
  return { executeMutation, ...res };
}

export function useEditExpense() {
  const [res, executeMutation] = useMutation(EDIT_EXPENSE);
  return { executeMutation, ...res };
}

export function useDeleteExpense() {
  const [res, executeMutation] = useMutation(DELETE_EXPENSE);
  return { executeMutation, ...res };
}