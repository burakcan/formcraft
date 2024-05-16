import { authMiddleware as createAuthMiddleware } from "@clerk/nextjs";
import { type NextFetchEvent, type NextRequest } from "next/server";

const authMiddleware = createAuthMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/forms/:form_id",
    "/api/submission/:submission_id",
  ],
  debug: true,
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
