import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProviderBlog } from "@/contexts/AuthContextBlog";

const API_URL = process.env.API_URL || "http://localhost:3333/";

const geistSans = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const response = await fetch(`${API_URL}configuration_blog/get_configs`, {
    cache: "no-store",
  });
  const blog = await response.json();

  return {
    title: blog?.name_blog || "Blog",
    description: blog?.description_blog || "Blog Description",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body id="root" className={`${geistSans.variable} antialiased`}>
        <AuthProvider>
          <AuthProviderBlog>
            <ToastContainer autoClose={5000} />
            {children}
          </AuthProviderBlog>
        </AuthProvider>
      </body>
    </html>
  );
}