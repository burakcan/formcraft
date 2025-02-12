import { z } from "zod";
import { getOptionID } from "@/lib/getID";
import { basePage } from "../schemas/basePage";
import { themeImage } from "../schemas/theming";

export const dropdownEditorSchema = basePage.extend({
  type: z.literal("dropdown").default("dropdown"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  options: z
    .array(
      z.object({
        label: z.string(),
        id: z.string(),
        image: themeImage.nullable(),
      })
    )
    .default([{ label: "Option 1", id: getOptionID(), image: null }]),
  placeholder: z.string().optional(),
  multiple: z.literal(false).default(false),
  randomize: z.boolean().default(false),
  clearable: z.boolean().default(true),
  orientation: z.literal("vertical").default("vertical"),
  imageChoices: z.literal(false).default(false),
});

export const getDropdownViewerSchema = (page: Dropdown) => {
  let answerSchema = z.array(z.string());
  
  if (page.required) {
    answerSchema = answerSchema.min(1, "Please select an option");
  }

  return answerSchema.default([]);
};

export type Dropdown = z.infer<typeof dropdownEditorSchema>;
export type DropdownValue = z.infer<ReturnType<typeof getDropdownViewerSchema>>;