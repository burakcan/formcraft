import { useEffect, useRef } from "react";
import type { CraftTheme } from "@/lib/craftPageConfig/theming";

interface Props {
  theme: CraftTheme;
}

export function ThemeStyle(props: Props) {
  const { theme } = props;
  const styleRef = useRef<HTMLStyleElement>();

  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
    }

    styleRef.current.innerHTML = `
      .craft-renderer {
          --craft-background: ${theme.backgroundColor};
          --craft-title: ${theme.titleColor};
          --craft-description: ${theme.descriptionColor};
          --craft-answers: ${theme.answersColor};
          --craft-button: ${theme.buttonColor};
          --craft-button-text: ${theme.buttonTextColor};
          --craft-font-size: ${
            theme.fontSize === "small"
              ? "0.75rem"
              : theme.fontSize === "medium"
              ? "1rem"
              : "1.25rem"
          };
          --craft-text-align: ${theme.textAlign};
          --craft-title-font: ${theme.titleFont};
          --craft-description-font: ${theme.descriptionFont};
        }
    `;

    document.head.appendChild(styleRef.current);

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, [theme]);

  return null;
}
