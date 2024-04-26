interface Props<T extends FormCraft.CraftPage> {
  page: T;
}

export function BaseContentViewer<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const { page } = props;

  return (
    <>
      {page.title && (
        <h1 className="text-craft-title font-craft-title w-full">
          {page.title}
        </h1>
      )}
      {page.description && (
        <p className="text-craft-description font-craft-description w-full">
          {page.description}
        </p>
      )}
    </>
  );
}
