import { useMutation, useQuery } from "urql";
import { ADD_USER, DELETE_USER, GET_USERS } from "../lib/queries";
import { User } from "../lib/types";

export function useUsers() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GET_USERS
  });

  return { 
    users: data?.userCollection?.edges.map((e: { node: User }) => e.node) || [], 
    error, 
    isLoading: fetching, 
    mutate: reexecute 
  };
}

export function useAddUser() {
  const [res, executeMutation] = useMutation(ADD_USER);
  return { executeMutation, ...res };
}
export function useDeleteUser() {
  const [res, executeMutation] = useMutation(DELETE_USER);
  return { executeMutation, ...res };
}
