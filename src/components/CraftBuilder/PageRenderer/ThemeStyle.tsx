import { useMemo } from "react";
import { HSLToRGB } from "@/lib/color";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
  pageId?: string;
}

export function ThemeStyle(props: Props) {
  const { theme, pageId } = props;

  const styleContent = useMemo(
    () => `
  .craft-renderer${pageId ? `#${pageId}` : ""} {
    --craft-background: ${theme.backgroundColor};
    --craft-title: ${theme.titleColor};
    --craft-description: ${theme.descriptionColor};
    --craft-answers: ${theme.answersColor};
    --craft-button: ${theme.buttonColor};
    --craft-button-text: ${theme.buttonTextColor};
    --craft-font-size: ${
      theme.fontSize === "small"
        ? "0.7rem"
        : theme.fontSize === "medium"
        ? "1rem"
        : "1.5rem"
    };
    --craft-text-align: ${theme.textAlign};
    --craft-title-font: ${theme.titleFont};
    --craft-description-font: ${theme.descriptionFont};
    --tw-prose-kbd: ${theme.descriptionColor};
    --tw-prose-kbd-shadows: ${HSLToRGB(theme.descriptionColor)};
  }`,
    [theme, pageId]
  );

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: styleContent,
      }}
    />
  );
}
