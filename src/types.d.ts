import type { Craft as DBCraft } from "@prisma/client";
import type { ReactFlowJsonObject } from "reactflow";
import type { z } from "zod";
import type { craftPageDefinitions } from "./craftPages";
import type { CraftTheme as _CraftTheme } from "@/craftPages/schemas/theming";

declare global {
  namespace FormCraft {
    type Craft = DBCraft & {
      archived: boolean;
      published: boolean;
      unpublishedChanges: boolean;
    };

    type CraftPage = z.infer<
      (typeof craftPageDefinitions)[keyof typeof craftPageDefinitions]["editorSchema"]
    >;

    type CraftAnswer = z.infer<
      (typeof craftPageDefinitions)[keyof typeof craftPageDefinitions]["viewerSchema"]
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

    type CraftListingItem = {
      id: string;
      title: string;
      archived: boolean;
      submissionsCount: number;
      published: boolean;
      unpublishedChanges: boolean;
    };

    type CraftSubmissionData = Record<
      string,
      {
        meta: {};
        value: FormCraft.CraftAnswer;
      }
    >;
  }

  namespace PrismaJson {
    type CraftPage = FormCraft.CraftPage;
    type CraftVersionData = FormCraft.CraftVersionData;
    type CraftTheme = _CraftTheme;
    type CraftSubmissionData = FormCraft.CraftSubmissionData;
  }
}
