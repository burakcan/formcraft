import { CreateCraftButton } from "@/components/CreateCraftButton";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full py-24">
      <div className="text-center ">
        <h2 className="text-lg font-bold">Welcome! 👋</h2>
        <p className="text-gray-500">
          Let&apos;s get started by creating your first form.
          <br />
          Or you can also import a form from a template to get started quickly.
        </p>
      </div>
      <CreateCraftButton />
    </div>
  );
}
