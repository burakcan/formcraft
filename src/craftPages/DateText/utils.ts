import { useMemo } from "react";
import type { DateFormat, Separator } from "./schema";

export const usePlaceholder = (
  dateFormat: DateFormat,
  separator: Separator
) => {
  return useMemo(() => {
    let result = {
      MMDDYYYY: "MM/DD/YYYY",
      DDMMYYYY: "DD/MM/YYYY",
      YYYYMMDD: "YYYY/MM/DD",
    }[dateFormat];

    if (separator) {
      result = result.replace(/\//g, `${separator}`);
    }

    return result;
  }, [dateFormat, separator]);
};
