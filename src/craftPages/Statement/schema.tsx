import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const statementEditorSchema = basePage.extend({
  type: z.literal("statement").default("statement"),
  cta: z.string().default("Let's go!"),
});

export const statementViewerSchema = z.literal(true);

export type Statement = z.infer<typeof statementEditorSchema>;

export type StatementAnswer = z.infer<typeof statementViewerSchema>;
