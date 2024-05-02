import { hexToHSL } from "../color";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export const greenery: CraftTheme = {
  id: "greenery",
  name: "Greenery",
  titleFont: "Averia Serif Libre",
  descriptionFont: "Averia Serif Libre",
  decorationImageLayout: "right-full",
  titleColor: hexToHSL("#0b6623"),
  descriptionColor: hexToHSL("#000000"),
  answersColor: hexToHSL("#0b6623"),
  backgroundColor: hexToHSL("#ffffff"),
  backgroundImage: {
    source: "unsplash",
    url: "/theme-backgrounds/greenery.jpg",
  },
  buttonColor: hexToHSL("#0b6623"),
  buttonTextColor: hexToHSL("#ffffff"),
  fontSize: "medium",
  textAlign: "left",
};
