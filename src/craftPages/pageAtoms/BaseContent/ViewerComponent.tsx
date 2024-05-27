import { template } from "lodash";
import { useViewCraftStore } from "@/hooks/useViewCraftStore";
import { cn } from "@/lib/utils";
import { craftPageDefinitions } from "@/craftPages";

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
  const { variables, pages, answers } = useViewCraftStore((state) => ({
    variables: state.variables,
    pages: state.version.data.pages,
    answers: state.answers,
  }));

  const { page } = props;

  let title = page.title;
  let description = page.description;

  const evaluateContentItem = (item: {
    type: "text" | "recall";
    text?: string;
    attrs?: { pageId: string; label: string };
  }) => {
    if (item.type === "text") {
      return item.text;
    } else if (item.type === "recall") {
      const recallingPage = pages.find((p) => p.id === item.attrs?.pageId);

      if (!recallingPage) {
        return "";
      }

      const pageDefinition = craftPageDefinitions[recallingPage.type];

      if (!("recall" in pageDefinition)) {
        return "";
      }

      const recallHandler = pageDefinition.recall.find(
        (r) => r.label === item.attrs?.label
      );

      if (!recallHandler) {
        return "";
      }

      type RecallingPage = (typeof recallHandler.fn)["arguments"][0];
      type RecallingValue = (typeof recallHandler.fn)["arguments"][1];
      type RecallFn = (page: RecallingPage, value: RecallingValue) => string;

      const recallResult = (recallHandler.fn as RecallFn)(
        recallingPage,
        answers[recallingPage.id]?.value
      );

      return recallResult;
    }
  };

  try {
    const baseContent = page.baseContent;
    if (baseContent) {
      const titleBaseContent = baseContent.content[0];
      const descriptionBaseContent = baseContent.content[1];

      title = titleBaseContent
        ? titleBaseContent.content?.map(evaluateContentItem).join("")
        : "";

      description = descriptionBaseContent
        ? descriptionBaseContent.content?.map(evaluateContentItem).join("")
        : "";
    }
  } catch (e) {
    console.error(e);
  }

  try {
    title = template(title || "", {
      interpolate: /{([\s\S]+?)}/g,
      imports: templateImports,
    })(variables);
  } catch (e) {
    console.error(e);
  }

  try {
    description = template(description || "", {
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
