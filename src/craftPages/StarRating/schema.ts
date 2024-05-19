import { z } from "zod";
import { basePage } from "../schemas/basePage";

export const starRatingEditorSchema = basePage.extend({
  type: z.literal("star_rating").default("star_rating"),
  cta: z.string().default("Confirm"),
  required: z.boolean().default(false),
  numStars: z.number().default(5),
  ratingIcon: z.enum(["star", "heart", "thumb", "smiley"]).default("star"),
});

export type StarRating = z.infer<typeof starRatingEditorSchema>;

export const getStarRatingViewerSchema = (page: StarRating) => {
  let answerSchema = z.number({
    required_error: "This field is required.",
    invalid_type_error: "This field is required.",
  });

  if (page.required) {
    answerSchema = answerSchema.min(1, {
      message: `This field is required.`,
    });
  }

  return answerSchema.default(0);
};
