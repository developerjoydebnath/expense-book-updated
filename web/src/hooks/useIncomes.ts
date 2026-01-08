// import { useEffect, useState } from "react";
// import { useMutation, useQuery } from "urql";
// import { ADD_INCOME, DELETE_INCOME, EDIT_INCOME, GET_INCOMES } from "../lib/queries";
// import { supabase } from "../lib/supabase";
// import { Income } from "../lib/types";

// export function useIncomes(dateFilter?: string, limit?: number, orderBy?: Record<string, string>[]) {
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setUserId(user?.id || null);
//     });
//   }, []);

//   const [{ data, fetching, error }, reexecute] = useQuery({
//     query: GET_INCOMES,
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
//     incomes: data?.incomeCollection?.edges.map((e: { node: Income }) => e.node) || [], 
//     error, 
//     isLoading: fetching, 
//     mutate: reexecute 
//   };
// }

// export function useAddIncome() {
//   const [res, executeMutation] = useMutation(ADD_INCOME);
//   return { executeMutation, ...res };
// }

// export function useEditIncome() {
//   const [res, executeMutation] = useMutation(EDIT_INCOME);
//   return { executeMutation, ...res };
// }

// export function useDeleteIncome() {
//   const [res, executeMutation] = useMutation(DELETE_INCOME);
//   return { executeMutation, ...res };
// }


// hooks/useIncomes.ts
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { ADD_INCOME, DELETE_INCOME, EDIT_INCOME, GET_INCOMES } from "../lib/queries";
import { supabase } from "../lib/supabase";
import { Income } from "../lib/types";

export function useIncomes(dateFilter?: string, limit?: number, orderBy?: Record<string, string>[]) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GET_INCOMES,
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
    console.log('useIncomes mutate() called');
    return reexecute({
      requestPolicy: 'network-only', // Force network request
    });
  };

  return { 
    incomes: data?.incomeCollection?.edges.map((e: { node: Income }) => e.node) || [], 
    error, 
    isLoading: fetching, 
    mutate,
    rawData: data // For debugging
  };
}

export function useAddIncome() {
  const [res, executeMutation] = useMutation(ADD_INCOME);
  return { executeMutation, ...res };
}

export function useEditIncome() {
  const [res, executeMutation] = useMutation(EDIT_INCOME);
  return { executeMutation, ...res };
}

export function useDeleteIncome() {
  const [res, executeMutation] = useMutation(DELETE_INCOME);
  return { executeMutation, ...res };
}