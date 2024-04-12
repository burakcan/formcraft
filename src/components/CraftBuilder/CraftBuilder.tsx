import { PageRenderer } from ".";

export function CraftBuilder() {
  return (
    <div className="flex flex-col justify-stretch items-stretch h-full">
      <div className="h-16 flex-none" />
      <div className="mx-2 flex-auto bg-background rounded shadow-md border">
        <PageRenderer />
      </div>
      <div className="h-16 flex-none" />
    </div>
  );
}
