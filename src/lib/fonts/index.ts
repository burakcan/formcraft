import {
  Inter,
  Emilys_Candy,
  Courgette,
  DM_Serif_Display,
  Abril_Fatface,
  Averia_Serif_Libre,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-craft",
});

const averiaSerifLibre = Averia_Serif_Libre({
  weight: ["300", "400", "700"],
  variable: "--font-craft",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  weight: "400",
  variable: "--font-craft",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-craft",
  subsets: ["latin"],
});

const courgette = Courgette({
  weight: "400",
  variable: "--font-craft",
  subsets: ["latin"],
});

const emilysCandy = Emilys_Candy({
  weight: "400",
  variable: "--font-craft",
  subsets: ["latin"],
});

export const fonts = {
  inter: {
    name: "Inter",
    id: "inter",
    font: inter,
  },
  "emilys-candy": {
    name: "Emilys Candy",
    id: "emilys-candy",
    font: emilysCandy,
  },
  courgette: {
    name: "Courgette",
    id: "courgette",
    font: courgette,
  },
  "dm-serif-display": {
    name: "DM Serif Display",
    id: "dm-serif-display",
    font: dmSerifDisplay,
  },
  "abril-fatface": {
    name: "Abril Fatface",
    id: "abril-fatface",
    font: abrilFatface,
  },
  "averia-serif-libre": {
    name: "Averia Serif Libre",
    id: "averia-serif-libre",
    font: averiaSerifLibre,
  },
};
