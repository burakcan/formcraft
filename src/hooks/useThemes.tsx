import type { CustomTheme } from "@prisma/client";
import { useMemo } from "react";
import type { CraftTheme } from "@/lib/craftPageConfig/theming";
import { builtinThemes } from "@/lib/themes";
import { useCustomThemesQuery } from "./useCustomThemesQuery";

const emptyArr: CustomTheme[] = [];

export function useThemes() {
  const { data: customThemesData } = useCustomThemesQuery();
  const customThemes = customThemesData?.data || emptyArr;

  const customThemesById = useMemo(() => {
    return customThemes.reduce<{
      [id: string]: CraftTheme;
    }>((acc, curr) => {
      acc[curr.id] = curr.data;
      return acc;
    }, {});
  }, [customThemes]);

  return useMemo(
    () => ({
      ...builtinThemes,
      ...customThemesById,
    }),
    [customThemesById]
  );
}
