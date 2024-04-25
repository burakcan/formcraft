import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/clerk", "/forms/:form_id"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
