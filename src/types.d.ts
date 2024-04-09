import type {
  EndScreen,
  Statement,
  ShortText,
  LongText,
} from "./lib/craftPageConfig";

declare global {
  namespace FormCraft {
    type CraftPage = EndScreen | Statement | ShortText | LongText;

    interface CraftVersionData {
      pages: CraftPage[];
    }
  }

  namespace PrismaJson {
    type CraftPage = FormCraft.CraftPage;
    type CraftVersionData = FormCraft.CraftVersionData;
  }
}
