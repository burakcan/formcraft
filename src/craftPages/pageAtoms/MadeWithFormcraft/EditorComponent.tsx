import { ThemeStyle } from "@/components/CraftBuilder/PageRenderer/ThemeStyle";
import type { CraftTheme } from "@/craftPages/schemas/theming";

interface Props {
  theme: CraftTheme;
}

export function MadeWithFormCraftEditor(props: Props) {
  const { theme } = props;

  return (
    <div
      id="madewithformcraft"
      className="craft-renderer p-1 px-2 text-[10px] bg-craft-button text-craft-button-text shadow-md absolute top-8 right-0 z-10 rounded-md rounded-r-none transition-colors duration-400"
    >
      <ThemeStyle theme={theme} pageId="madewithformcraft" />
      <a
        href="https://formcraft.io"
        target="_blank"
        rel="noopener noreferrer"
        className=" no-underline bold text-craft-button-text"
      >
        Powered by <strong>FormCraft</strong>
      </a>
    </div>
  );
}
