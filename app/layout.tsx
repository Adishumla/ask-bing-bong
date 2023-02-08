import "./globals.css";
import { AnalyticsWrapper } from "../components/analytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark:bg-gray-900 overflow-hidden h-screen w-screen border-box overscroll-none"
    >
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
