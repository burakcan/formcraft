// import type {
//   EndScreen,
//   Statement,
//   ShortText,
//   LongText,
// } from "./lib/craftPageConfig";
import type { z } from "zod";
import type { pageDefinitions } from "./lib/craftPageConfig";

declare global {
  namespace FormCraft {
    type CraftPage = z.infer<
      (typeof pageDefinitions)[keyof typeof pageDefinitions]["schema"]
    >;

    interface CraftVersionData {
      pages: CraftPage[];
    }
  }

  namespace PrismaJson {
    type CraftPage = FormCraft.CraftPage;
    type CraftVersionData = FormCraft.CraftVersionData;
  }
}
