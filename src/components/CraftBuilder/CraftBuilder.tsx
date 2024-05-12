import { PageRenderer } from ".";

export function CraftBuilder() {
  return (
    <div className="flex flex-col justify-stretch items-stretch h-full">
      <div className="h-8 flex-none" />
      <div className="mx-4 flex-auto bg-background rounded overflow-hidden shadow-md light transform-gpu">
        <PageRenderer />
      </div>
      <div className="h-8 flex-none" />
    </div>
  );
}
