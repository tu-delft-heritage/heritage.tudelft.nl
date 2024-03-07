import createMiddleware from "next-intl/middleware";

// Additional configuration, such as localising the URL can be found here:
// - https://next-intl-docs.vercel.app/docs/routing/middleware
export default createMiddleware({
  locales: ["en", "nl"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(nl|en)/:path*"],
};
