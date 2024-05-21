import { FaStripeS } from "react-icons/fa";
import { StripePaymentContentSettings } from "./ContentSettings";
import { StripePaymentEditor } from "./EditorComponent";
import {
  getStripePaymentViewerSchema,
  stripePaymentEditorSchema,
} from "./schema";
import { StripePaymentViewer } from "./ViewerComponent";

const pageDefinition = {
  name: "Stripe payment",
  description: "Collect payments with Stripe",

  editorComponent: StripePaymentEditor,
  editorSchema: stripePaymentEditorSchema,
  viewerComponent: StripePaymentViewer,
  getViewerSchema: getStripePaymentViewerSchema,
  settingsComponent: StripePaymentContentSettings,

  icon: FaStripeS,
  iconClassName: "bg-indigo-500 text-white",
};

export default pageDefinition;
