"use client";
import { LinkIcon, LoaderCircle, SheetIcon } from "lucide-react";
import { useState } from "react";
import { useCraftConnectionsMutation } from "@/hooks/useCraftConnectionsMutation";
import { useCraftConnectionsQuery } from "@/hooks/useCraftConnectionsQuery";
import { useEditCraftStore } from "@/hooks/useEditCraftStore";
import { Button } from "../ui/button";
import { ConnectionCard } from "./ConnectionCard";

export function GoogleSheetsCard() {
  const [loading, setLoading] = useState(false);
  const craftId = useEditCraftStore((state) => state.craft.id);
  const { data: connections } = useCraftConnectionsQuery(craftId);
  const mutation = useCraftConnectionsMutation(craftId);

  const handleDisconnect = () => {
    mutation.mutate({ googleSheets: null });
  };

  return (
    <ConnectionCard
      title="Google Sheets"
      description="Save submissions to a Google Sheet."
      icon={SheetIcon}
      iconClassName="text-green-500"
    >
      <div className="flex justify-end">
        {!connections?.googleSheets && (
          <Button asChild onClick={() => setLoading(true)}>
            <a
              href={`/api/form/${craftId}/connections/google-sheets/authorize`}
            >
              {loading ? (
                <LoaderCircle className="animate-spin size-4" />
              ) : (
                "Connect"
              )}
            </a>
          </Button>
        )}
        {connections?.googleSheets && (
          <div className="flex justify-end items-center gap-2">
            <Button variant="outline" asChild>
              <a href={connections.googleSheets.sheetUrl} target="_blank">
                <LinkIcon className="size-4 mr-2" />
                View Sheet
              </a>
            </Button>
            <Button onClick={handleDisconnect} variant="destructive">
              {mutation.status === "pending" ? (
                <LoaderCircle className="animate-spin size-4" />
              ) : (
                "Disconnect"
              )}
            </Button>
          </div>
        )}
      </div>
    </ConnectionCard>
  );
}
