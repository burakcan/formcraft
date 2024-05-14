import { useQuery } from "@tanstack/react-query";

export function usePaddleIdsQuery(userId: string, organizationId: string = "") {
  return useQuery({
    queryKey: ["paddle-ids", userId, organizationId],
    queryFn: async () => {
      const res = await fetch("/api/paddle-ids");
      return res.json();
    },
  });
}
