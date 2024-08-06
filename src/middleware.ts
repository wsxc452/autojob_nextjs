import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

const isPublicRoute = createRouteMatcher([
  // "/api/(.*)",
  "/api/task/(.*)",
  "/api/search",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/auth-callback(.*)",
  "/h5/login",
  "/h5/register",
]);

const isTenantRoute = createRouteMatcher([
  "/h5(.*)",
  // '/orgid/(.*)'
]);

const isTenantAdminRoute = createRouteMatcher([
  "/orgId/(.*)/memberships",
  "/orgId/(.*)/domain",
]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(
  (auth, request) => {
    // 如果不是公共路由,需要拦截
    console.log("request.url", request.url);
    if (!isPublicRoute(request)) {
      // 如果是api路由,需要验证登录
      if (isApiRoute(request)) {
        if (!auth().userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
        }
      }

      // h5项目,需要验证登录
      if (request.url.includes("/h5/")) {
        const signInUrl = new URL("/h5/login", request.url);
        console.log("signInUrl", signInUrl.toString());
        auth().protect({
          unauthorizedUrl: signInUrl.toString(),
          unauthenticatedUrl: signInUrl.toString(),
        });
      } else {
        // 说明是pc项目,按默认拦截
        const signInUrl = new URL("/sign-in", request.url);
        auth().protect({
          unauthorizedUrl: signInUrl.toString(),
          unauthenticatedUrl: signInUrl.toString(),
        });
      }
    }
  },
  {
    debug: false,
  },
);
