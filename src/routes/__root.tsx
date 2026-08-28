import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Catholib";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "A Catholic library of Sacred Scripture, the living Magisterium, and the 1962 Roman Missal, drawn only from the Holy See, the USCCB, EWTN, the Douay-Rheims, and confirmed commentary sources.",
      },
      { name: "theme-color", content: "#0a0e14" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "application-name", content: APP_NAME },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", href: "/favicon.ico?v=2", sizes: "48x48" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png?v=2" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png?v=2" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png?v=2" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=2" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=2" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,500;0,7..72,600;0,7..72,700;1,7..72,500;1,7..72,600&family=Nunito+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
