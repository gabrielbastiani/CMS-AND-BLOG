import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProviderBlog } from "@/contexts/AuthContextBlog";

// Configuração da fonte local
const geistSans = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  weight: "100 900",
});

// Função para gerar metadados dinâmicos
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Faz uma requisição para sua API
    const response = await fetch("http://localhost:3333/configuration_blog/get_configs");
    const data = await response.json();

    // Retorna os metadados dinâmicos
    return {
      title: data.name_blog || "Blog",
      description: data.name_blog || "Blog",
    };
  } catch (error) {
    console.error("Erro ao buscar metadados:", error);
    // Retorna valores padrão em caso de erro
    return {
      title: "Blog",
      description: "Blog",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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