import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Brushly — Premium Painting Services On-Demand" },
      {
        name: "description",
        content: "Book trusted, professional painters in minutes. Interior, exterior, commercial — affordable, fast and guaranteed.",
      },
      { property: "og:title", content: "Brushly — Premium Painting Services On-Demand" },
      { name: "twitter:title", content: "Brushly — Premium Painting Services On-Demand" },
      { name: "description", content: "Paint Perfect is a modern web application for booking professional painting services." },
      { property: "og:description", content: "Paint Perfect is a modern web application for booking professional painting services." },
      { name: "twitter:description", content: "Paint Perfect is a modern web application for booking professional painting services." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/440bda9d-3fba-4853-a1fc-b4ee62a86ec2/id-preview-d49e079f--7d0abf06-9c45-4572-8fd6-df8d9969a31f.lovable.app-1776690772180.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/440bda9d-3fba-4853-a1fc-b4ee62a86ec2/id-preview-d49e079f--7d0abf06-9c45-4572-8fd6-df8d9969a31f.lovable.app-1776690772180.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: () => <Outlet />,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
