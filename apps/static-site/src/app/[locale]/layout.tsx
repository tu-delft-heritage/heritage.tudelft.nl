import "../globals.css";
import type { Metadata } from "next";
import BlockEditor from "../../blocks/block-editor";
import { Provider } from "../provider";
import { ReactNode } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { GlobalHeader } from "@/components/GlobalHeader";
import localFont from "next/font/local";
import { SlotContext } from "@/blocks/slot-context";
import { GlobalFooter } from "@/components/GlobalFooter";

export const metadata: Metadata = {
  title: "TU Delft Academic Heritage",
  description: "TU Delft Library's Special Collections portal"
};

if (process.env.NODE_ENV !== "production") {
  // @ts-expect-error typescript can't resolve CSS
  import("@page-blocks/react-editor/dist/index.css");
  // @ts-expect-error typescript can't resolve CSS
  import("@page-blocks/react/dist/index.css");
  // @ts-expect-error typescript can't resolve CSS
  import("@page-blocks/web-components/dist/index.css");
}

const foundersGrotesk = localFont({
  variable: "--f-font",
  preload: true,
  src: [
    {
      path: "../fonts/founders-grotesk-web-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/founders-grotesk-web-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/founders-grotesk-web-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/founders-grotesk-web-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
});

const foundersGroteskMono = localFont({
  variable: "--f-mono-font",
  preload: true,
  src: [
    {
      path: "../fonts/founders-grotesk-mono-web-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/founders-grotesk-mono-web-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

export async function generateStaticParams() {
  return [{ locale: "nl" }, { locale: "en" }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}): JSX.Element {
  unstable_setRequestLocale(params.locale);
  return (
    <html lang={params.locale}>
      <body className={`bg-gray-200 ${foundersGrotesk.variable} ${foundersGroteskMono.variable} font-sans`}>
        <Provider>
          <SlotContext name="locale" value={params.locale}>
            <GlobalHeader />
            <main className="flex w-full flex-col items-center">{children}</main>
            {process.env.NODE_ENV !== "production" ? <BlockEditor showToggle rsc /> : null}
            <GlobalFooter />
          </SlotContext>
        </Provider>
      </body>
    </html>
  );
}
