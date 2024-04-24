"use server";

import { SheetIcon } from "lucide-react";

export default async function Loading() {
  return (
    <div className="fixed top-0 left-0 size-full flex items-center justify-center bg-accent">
      <div className="p-4 bg-background rounded shadow-md">
        <SheetIcon className="text-green-500 animate-pulse" size={48} />
        <h1 className="text-2xl font-bold">
          Setting up Google Sheets Connection
        </h1>
        <p className="mt-2">
          Please wait while we set up the connection to Google Sheets.
        </p>
      </div>
    </div>
  );
}
