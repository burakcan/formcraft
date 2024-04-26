import { useMemo } from "react";
import type { CraftTheme } from "@/lib/craftPageConfig/theming";

interface Props {
  theme: CraftTheme;
}

export function ThemeStyle(props: Props) {
  const { theme } = props;

  const styleContent = useMemo(
    () => `
  .craft-renderer {
    --craft-background: ${theme.backgroundColor};
    --craft-title: ${theme.titleColor};
    --craft-description: ${theme.descriptionColor};
    --craft-answers: ${theme.answersColor};
    --craft-button: ${theme.buttonColor};
    --craft-button-text: ${theme.buttonTextColor};
    --craft-font-size: ${
      theme.fontSize === "small"
        ? "1rem"
        : theme.fontSize === "medium"
        ? "1.25rem"
        : "1.5rem"
    };
    --craft-text-align: ${theme.textAlign};
    --craft-title-font: ${theme.titleFont};
    --craft-description-font: ${theme.descriptionFont};
  }`,
    [theme]
  );

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: styleContent,
      }}
    />
  );
}
