"use client";

import { useState } from "react";
import { ThemeCustomization } from "./ThemeCustomization";
import { ThemeSelection } from "./ThemeSelection";

interface Props {
  selectedPage: FormCraft.CraftPage;
  editPage: (id: string, page: FormCraft.CraftPage) => void;
}

export function DesignTab(props: Props) {
  const { selectedPage, editPage } = props;
  const hasOverrides = Object.keys(selectedPage.themeOverride || {}).length;
  const [screen, setScreen] = useState<"themes" | "custom">(
    hasOverrides ? "custom" : "themes"
  );

  return screen === "custom" ? (
    <ThemeCustomization
      selectedPage={selectedPage}
      editPage={editPage}
      onGallery={() => setScreen("themes")}
    />
  ) : (
    <ThemeSelection
      hasOverrides={Boolean(hasOverrides)}
      selectedThemeId={selectedPage.baseThemeId}
      onSelectTheme={(themeId) => {
        editPage(selectedPage.id, {
          ...selectedPage,
          baseThemeId: themeId,
          themeOverride:
            themeId === selectedPage.baseThemeId
              ? selectedPage.themeOverride
              : {},
        });
      }}
      onCustomize={() => setScreen("custom")}
    />
  );
}
