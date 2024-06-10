import type { Craft as DBCraft } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import type { ReactFlowJsonObject } from "reactflow";
import type { Stripe } from "stripe";
import type { z } from "zod";
import type { craftPageDefinitions } from "./craftPages";
import type { CraftTheme as _CraftTheme } from "@/craftPages/schemas/theming";

declare global {
  namespace PageDefinition {
    type EditorComponent<T> = React.ComponentType<{
      page: T;
      onChange: (pageId: string, page: T) => void;
    }>;

    type ViewerComponent<T> = React.ComponentType<{
      page: T;
    }>;

    type SettingsComponent<T> = React.ComponentType<{
      page: T;
      onChange: (page: T) => void;
    }>;

    type EditorSchema<T> = z.ZodType<T, any, any>;

    type ViewerSchema<AT> = z.ZodType<AT, any, any>;

    type RecallFunction<T, AT> = {
      label: string;
      fn: (page: T, value: AT) => string | undefined;
    };

    type ComparisonDefinition<T, AT> =
      | {
          id: string;
          type: "text";
          label: string;
          operator: (value: AT, comparison: string) => boolean;
        }
      | {
          id: string;
          type: "number";
          label: string;
          operator: (value: AT, comparison: number) => boolean;
        }
      | {
          id: string;
          type: "date";
          label: string;
          operator: (value: AT, comparison: string) => boolean;
        }
      | {
          id: string;
          type: "choice";
          label: {
            single: string;
            multiple: string;
          };
          getIsMultiple: (page: T) => boolean;
          getOptions: (page: T) => { id: string; label: string }[];
          operator: (value: AT, comparison: string[]) => boolean;
        };

    interface Definition<T, AT> {
      name: string;
      description: string;
      editorComponent: EditorComponent<T>;
      editorSchema: EditorSchema<T>;
      viewerComponent: ViewerComponent<T>;
      getViewerSchema: (page: T) => ViewerSchema<AT>;
      settingsComponent: SettingsComponent<T>;
      icon: LucideIcon | IconType;
      iconClassName: string;
      recall: RecallFunction<T, AT>[];
      comparisons: ComparisonDefinition<T, AT>[];
    }
  }

  namespace Condition {
    type ConditionItem = {
      id: string;
      sourceId: string;
      sourceType: "page" | "variable";
      comparisonId: string;
      comparisonValue: string | number | string[] | number[];
    };
  }

  namespace FormCraft {
    type Craft = DBCraft & {
      archived: boolean;
      published: boolean;
      unpublishedChanges: boolean;
    };

    type CraftPageDefinitions = typeof craftPageDefinitions;

    type CraftPageType = keyof CraftPageDefinitions;

    type CraftPageDefinition = CraftPageDefinitions[CraftPageType];

    type CraftPage = z.infer<CraftPageDefinition["editorSchema"]>;
    type CraftEndPage = z.infer<
      CraftPageDefinitions["end_screen"]["editorSchema"]
    >;

    type CraftAnswer = z.infer<
      ReturnType<CraftPageDefinition["getViewerSchema"]>
    >;

    interface CraftVersionData {
      pages: CraftPage[];
      end_pages: CraftEndPage[];
      flow: ReactFlowJsonObject;
      defaultTheme: string;
      defaultLogo?: ThemeImageType | undefined;
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

    type StripePriceType = "recurring" | "one_time";
    type StripePriceInterval = "month" | "year" | "week" | "day";
    type StripeSubscriptionStatus =
      | "incomplete"
      | "incomplete_expired"
      | "trialing"
      | "active"
      | "past_due"
      | "canceled"
      | "unpaid"
      | "paused";
  }

  namespace PrismaJson {
    type CraftPage = FormCraft.CraftPage;
    type CraftVersionData = FormCraft.CraftVersionData;
    type CraftTheme = _CraftTheme;
    type CraftSubmissionData = FormCraft.CraftSubmissionData;
    type StripeAccountData = Stripe.Account;
  }
}
