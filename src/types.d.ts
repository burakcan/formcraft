import type { ReactFlowJsonObject } from "reactflow";
import type { z } from "zod";
import type { CraftTheme as _CraftTheme } from "@/lib/craftPageConfig/theming";
import type { pageDefinitions } from "./lib/craftPageConfig";

declare global {
  namespace FormCraft {
    type CraftPage = z.infer<
      (typeof pageDefinitions)[keyof typeof pageDefinitions]["schema"]
    >;

    interface CraftVersionData {
      pages: CraftPage[];
      flow: ReactFlowJsonObject;
    }

    type BranchingConditionType =
      | "eq"
      | "neq"
      | "gt"
      | "lt"
      | "gte"
      | "lte"
      | "contains"
      | "not_contains"
      | "starts_with"
      | "ends_with";

    interface BranchingConditionDefault {
      id: "default";
      source: "default";
    }

    interface BranchingConditionInput {
      id: string;
      source: "input";
      condition: BranchingConditionType;
      value: string;
    }

    interface BranchingConditionVariable {
      id: string;
      source: "variable";
      condition: BranchingConditionType;
      variableName: string;
      value: string;
    }

    type BranchingCondition =
      | BranchingConditionDefault
      | BranchingConditionInput
      | BranchingConditionVariable;
  }

  namespace PrismaJson {
    type CraftPage = FormCraft.CraftPage;
    type CraftVersionData = FormCraft.CraftVersionData;
    type CraftTheme = _CraftTheme;
  }
}
