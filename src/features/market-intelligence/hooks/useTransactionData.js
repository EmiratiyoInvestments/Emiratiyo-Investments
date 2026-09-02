import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "../ingest/loadTransactions";
import { computeCityStats } from "../aggregate/cityStats";

export function useTransactionData() {
  const {
    data: rows = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ["transaction-csv"],
    queryFn: loadTransactions,
    staleTime: Infinity
  });
  const stats = useMemo(() => computeCityStats(rows), [rows]);
  return {
    rows,
    stats,
    loading,
    error
  };
}
