import { hexToHSL } from "../color";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export const dark: CraftTheme = {
  id: "dark",
  name: "Dark",
  titleFont: "Inter",
  descriptionFont: "Inter",
  titleColor: hexToHSL("#FFFFFF"),
  descriptionColor: hexToHSL("#FFFFFF"),
  answersColor: hexToHSL("#FFFFFF"),
  backgroundColor: hexToHSL("#000000"),
  decorationImageLayout: "right-full",
  buttonColor: hexToHSL("#FFFFFF"),
  buttonTextColor: hexToHSL("#000000"),
  fontSize: "medium",
  textAlign: "left",
};
