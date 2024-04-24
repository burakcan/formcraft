import type {
  EmailConnection,
  GoogleSheetsConnection,
  WebhookConnection,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { setCraftConnectionsQueryData } from "./useCraftConnectionsQuery";

export function useCraftConnectionsMutation(craftId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      email,
      webhook,
      googleSheets,
    }: {
      email?: Partial<EmailConnection> | null;
      webhook?: Partial<WebhookConnection> | null;
      googleSheets?: Partial<GoogleSheetsConnection> | null;
    }) => {
      const response = await fetch(`/api/form/${craftId}/connections`, {
        method: "PUT",
        body: JSON.stringify({
          email,
          webhook,
          googleSheets,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setCraftConnectionsQueryData(queryClient, craftId, data);
    },
  });

  return useMemo(
    () => ({
      ...mutation,
    }),
    [mutation]
  );
}
