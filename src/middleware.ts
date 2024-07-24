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
  "/h5/login",
  "/h5/register",
]);
export default clerkMiddleware(
  (auth, request) => {
    console.log("request.url", request.url);
    if (!isPublicRoute(request)) {
      // h5项目,如果首页没有登录,则跳转到登录页
      if (request.url.includes("/h5/index")) {
        const signInUrl = new URL("/h5/login", request.url);
        console.log("signInUrl", signInUrl.toString());
        auth().protect({
          unauthorizedUrl: signInUrl.toString(),
          unauthenticatedUrl: signInUrl.toString(),
        });
      } else {
        auth().protect();
      }
    }
  },
  {
    debug: false,
  },
);
