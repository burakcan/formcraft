import type { CraftTheme } from "../craftPageConfig/theming";
import { candy } from "./candy";
import { dark } from "./dark";
import { defaultTheme } from "./defaultTheme";
import { greenery } from "./greenery";

export const builtinThemes: Record<string, CraftTheme> = {
  [defaultTheme.id]: defaultTheme,
  [dark.id]: dark,
  [candy.id]: candy,
  [greenery.id]: greenery,
};
