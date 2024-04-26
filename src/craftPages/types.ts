// import type { LucideIcon } from "lucide-react";
// import type { ComponentType } from "react";
// import type { ZodTypeAny } from "zod";
// import type { BasePage } from "./schemas/basePage";

// export interface EditorComponentProps<T extends FormCraft.CraftPage> {
//   page: T;
//   onChange: (pageId: string, page: T) => void;
// }

// export interface ViewerComponentProps<T extends FormCraft.CraftPage> {
//   page: T;
// }

// export interface CraftPageDefinition<
//   T extends FormCraft.CraftPage,
//   ES extends BasePage,
//   VS extends ZodTypeAny
// > {
//   name: string;
//   description: string;
//   editorComponent: ComponentType<EditorComponentProps<T>>;
//   editorSchema: ES;
//   viewerComponent: ComponentType<ViewerComponentProps<T>>;
//   viewerSchema: VS;
//   icon: LucideIcon;
//   iconClassName: string;
// }
