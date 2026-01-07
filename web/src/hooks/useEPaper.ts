import { useMutation, useQuery } from "urql";
import { ADD_EPAPER, ADD_HOTSPOT, DELETE_EPAPER, GET_EPAPERS, GET_EPAPER_BY_ID } from "../lib/queries";
import { EPaper, Hotspot } from "../lib/types";

export function useEPapers() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GET_EPAPERS
  });

  return { 
    ePapers: data?.ePaperCollection?.edges.map((e: { node: EPaper }) => e.node) || [], 
    error, 
    isLoading: fetching, 
    mutate: reexecute 
  };
}

export function useEPaper(id: string) {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: GET_EPAPER_BY_ID,
    variables: { id },
    pause: !id
  });

  const node = data?.ePaperCollection?.edges[0]?.node;
  const ePaper = node ? {
    ...node,
    hotspots: node.hotspotCollection?.edges.map((e: { node: Hotspot }) => e.node) || []
  } : null;

  return { 
    ePaper, 
    error, 
    isLoading: fetching, 
    mutate: reexecute 
  };
}

export function useAddEPaper() {
  const [res, executeMutation] = useMutation(ADD_EPAPER);
  return { executeMutation, ...res };
}

export function useAddHotspot() {
  const [res, executeMutation] = useMutation(ADD_HOTSPOT);
  return { executeMutation, ...res };
}

export function useDeleteEPaper() {
  const [res, executeMutation] = useMutation(DELETE_EPAPER);
  return { executeMutation, ...res };
}
