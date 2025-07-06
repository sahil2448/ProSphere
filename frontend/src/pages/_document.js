import { Html, Head, Main, NextScript } from "next/document";
import { Toaster } from "sonner";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
