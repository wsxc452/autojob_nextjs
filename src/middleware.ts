import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/h5/(.*)",
]);
export default clerkMiddleware(
  (auth, request) => {
    if (!isPublicRoute(request)) {
      auth().protect();
    }
  },
  {
    debug: true,
  },
);
