"use server";

import { MailIcon } from "lucide-react";

export default async function Loading() {
  return (
    <div className="fixed top-0 left-0 size-full flex items-center justify-center bg-accent">
      <div className="p-4 bg-background rounded shadow-md">
        <MailIcon className="text-red-500 animate-pulse" size={48} />
        <h1 className="text-2xl font-bold">Setting up Email Connection</h1>
        <p className="mt-2">This will only take a few seconds.</p>
      </div>
    </div>
  );
}
