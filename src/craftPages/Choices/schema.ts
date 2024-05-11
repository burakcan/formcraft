import { nanoid } from "nanoid";
import { z } from "zod";
import { basePage } from "../schemas/basePage";
import { themeImage } from "../schemas/theming";

export const choicesEditorSchema = basePage.extend({
  type: z.literal("choices").default("choices"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  multiple: z.boolean().default(false),
  minSelections: z.number().optional().nullable(),
  maxSelections: z.number().optional().nullable(),
  randomize: z.boolean().default(false),
  orientation: z.enum(["vertical", "horizontal"]).default("vertical"),
  imageChoices: z.boolean().default(false),
  options: z
    .array(
      z.object({
        label: z.string(),
        id: z.string(),
        image: themeImage.nullable(),
      })
    )
    .default([{ label: "Option 1", id: nanoid(3), image: null }]),
});

export type Choices = z.infer<typeof choicesEditorSchema>;

export const getChoicesViewerSchema = (page: Choices) => {
  let answerSchema = z.array(z.string());

  if (page.required) {
    answerSchema = answerSchema.min(1, {
      message: "This field is required.",
    });
  }

  if (page.minSelections) {
    answerSchema = answerSchema.min(page.minSelections, {
      message: `Please select at least ${page.minSelections} options.`,
    });
  }

  if (page.maxSelections) {
    answerSchema = answerSchema.max(page.maxSelections, {
      message: `Please select no more than ${page.maxSelections} options.`,
    });
  }

  return answerSchema.default([]);
};
