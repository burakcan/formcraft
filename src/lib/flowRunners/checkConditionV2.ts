import type { ViewCraftStoreState } from "@/services/store/viewCraftStore";
import { craftPageDefinitions } from "@/craftPages";

export function checkConditionV2(
  draft: ViewCraftStoreState,
  condition: Condition.ConditionItem
) {
  if (condition.sourceType === "variable") {
    return false;
  }

  const page = draft.version.data.pages.find(
    (p) => p.id === condition.sourceId
  );

  if (!page) {
    return false;
  }

  const pageDefinition = craftPageDefinitions[page.type];

  if (!pageDefinition) {
    return false;
  }

  const comparison = pageDefinition.comparisons.find(
    (c) => c.id === condition.comparisonId
  );

  if (!comparison) {
    return false;
  }

  const pageValue = draft.answers[page.id].value;

  // @ts-ignore
  return comparison.operator(pageValue as any, condition.comparisonValue);
}
