import Head from "next/head";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Access Residencies",
  description: "Access Residencies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
        />
      </Head>
      <body>
        {" "}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
