"use client";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { createCraft } from "@/actions/createCraft";

function CreateCraftButtonInternal() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit">
      {pending ? (
        <LoaderCircle className="animate-spin mr-2 size-5" />
      ) : (
        <PlusIcon className="mr-2 size-5" />
      )}
      Create new form
    </Button>
  );
}

export function CreateCraftButton() {
  return (
    <form action={createCraft}>
      <CreateCraftButtonInternal />
    </form>
  );
}
