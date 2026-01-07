"use client";
import { Provider } from "urql";
import { graphqlClient } from "../lib/graphqlClient";

export function GraphqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={graphqlClient}>{children}</Provider>;
}
