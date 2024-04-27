import { template } from "lodash";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

interface Props<T extends FormCraft.CraftPage> {
  page: T;
}

export function BaseContentViewer<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const variables = useViewCraftStore((state) => state.variables);
  const { page } = props;

  const title = template(page.title || "", {
    interpolate: /{([\s\S]+?)}/g,
  })(variables);

  const description = template(page.description || "", {
    interpolate: /{([\s\S]+?)}/g,
  })(variables);

  return (
    <>
      {page.title && (
        <h1 className="text-craft-title font-craft-title w-full">{title}</h1>
      )}
      {page.description && (
        <p className="text-craft-description font-craft-description w-full">
          {description}
        </p>
      )}
    </>
  );
}
