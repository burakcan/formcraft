import { template } from "lodash";
import { cn } from "@/lib/utils";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";

interface Props<T extends FormCraft.CraftPage> {
  page: T;
}

function notify() {
  console.log(
    "If you need to call a function, please email us at hello@formcraft.io with your use case."
  );
}

const templateImports = {
  window: new Proxy({}, { get: () => notify }),
  document: new Proxy({}, { get: () => notify }),
  history: new Proxy({}, { get: () => notify }),
  location: new Proxy({}, { get: () => notify }),
  localStorage: new Proxy({}, { get: () => notify }),
  sessionStorage: new Proxy({}, { get: () => notify }),
  fetch: notify,
  alert: notify,
  confirm: notify,
  prompt: notify,
  FormData: notify,
  setTimeout: notify,
  clearTimeout: notify,
  setInterval: notify,
  clearInterval: notify,
  requestAnimationFrame: notify,
  cancelAnimationFrame: notify,
  XMLHttpRequest: notify,
  WebSocket: notify,
  Headers: notify,
  Request: notify,
  Response: notify,
  URL: notify,
  URLSearchParams: notify,
  Date: new Proxy({}, { get: () => notify }),
  console: new Proxy({}, { get: () => notify }),
};

export function BaseContentViewer<T extends FormCraft.CraftPage>(
  props: Props<T>
) {
  const variables = useViewCraftStore((state) => state.variables);
  const { page } = props;

  let title = page.title;
  try {
    title = template(page.title || "", {
      interpolate: /{([\s\S]+?)}/g,
      imports: templateImports,
    })(variables);
  } catch (e) {
    console.error(e);
  }

  let description = page.description;
  try {
    description = template(page.description || "", {
      interpolate: /{([\s\S]+?)}/g,
      imports: templateImports,
    })(variables);
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      {page.title && (
        <h1
          className={cn("text-craft-title font-craft-title w-full relative", {
            "before:content-['*'] before:absolute before:-left-3 before:top-1 before:text-base before:text-destructive":
              "required" in page && page.required,
          })}
        >
          {title}
        </h1>
      )}
      {page.description && (
        <p className="text-craft-description font-craft-description w-full">
          {description}
        </p>
      )}
    </>
  );
}
