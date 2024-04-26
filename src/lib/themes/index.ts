import { candy } from "./candy";
import { dark } from "./dark";
import { defaultTheme } from "./defaultTheme";
import { greenery } from "./greenery";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export const builtinThemes: Record<string, CraftTheme> = {
  [defaultTheme.id]: defaultTheme,
  [dark.id]: dark,
  [candy.id]: candy,
  [greenery.id]: greenery,
};
