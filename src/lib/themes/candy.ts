import { hexToHSL } from "../color";
import type { CraftTheme } from "@/craftPages/schemas/theming";

export const candy: CraftTheme = {
  id: "candy",
  name: "Candy",
  titleFont: "Courgette",
  descriptionFont: "Courgette",
  titleColor: hexToHSL("#000000"),
  descriptionColor: hexToHSL("#000000"),
  answersColor: hexToHSL("#000000"),
  decorationImageLayout: "right-full",
  backgroundColor: hexToHSL("#ffffff"),
  backgroundImage: {
    source: "unsplash",
    url: "/theme-backgrounds/candy.jpg",
  },
  buttonColor: hexToHSL("#ff69b4"),
  buttonTextColor: hexToHSL("#ffffff"),
  fontSize: "medium",
  textAlign: "left",
};
