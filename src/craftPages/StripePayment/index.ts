import { FaStripeS } from "react-icons/fa";
import { StripePaymentContentSettings } from "./ContentSettings";
import { StripePaymentEditor } from "./EditorComponent";
import type { StripePayment, StripePaymentValue } from "./schema";
import {
  getStripePaymentViewerSchema,
  stripePaymentEditorSchema,
} from "./schema";
import { StripePaymentViewer } from "./ViewerComponent";

const pageDefinition: PageDefinition.Definition<
  StripePayment,
  StripePaymentValue
> = {
  name: "Stripe payment",
  description: "Collect payments with Stripe",

  editorComponent: StripePaymentEditor,
  editorSchema: stripePaymentEditorSchema,
  viewerComponent: StripePaymentViewer,
  getViewerSchema: getStripePaymentViewerSchema,
  settingsComponent: StripePaymentContentSettings,

  icon: FaStripeS,
  iconClassName: "bg-indigo-500 text-white",

  recall: [
    {
      label: "price",
      fn: (page: StripePayment) => {
        const priceFormatter = new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: page.currency,
        });

        return priceFormatter.format(page.price ? page.price : 0);
      },
    },
  ],
};

export default pageDefinition;
