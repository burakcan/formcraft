import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const statementEditorSchema = basePage.extend({
  type: z.literal("statement").default("statement"),
  cta: z.string().default("Let's go!"),
});

export const statementViewerSchema = z.literal(true);

export type Statement = z.infer<typeof statementEditorSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getStatementViewerSchema = (page: Statement) => {
  const answerSchema = z.literal(true);
  return answerSchema;
};
