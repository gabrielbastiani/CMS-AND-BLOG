import BlogLayout from "./components/blog_components/blogLayout";
import { Footer } from "./components/blog_components/footer";
import { Navbar } from "./components/blog_components/navbar";
import { SlideBanner } from "./components/blog_components/slideBanner";
import HomePage from "./components/blog_components/homePage";
import { setupAPIClient } from "@/services/api";
import PublicationSidebar from "./components/blog_components/publicationSidebar";
import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(): Promise<Metadata> {
  const apiClient = setupAPIClient();
  try {
    const response = await apiClient.get('/configuration_blog/get_configs');
    const imageUrl = response.images
      ? new URL(`/files/${response.images}`, API_URL).toString()
      : new URL("../assets/no-image-icon-6.png", BLOG_URL).toString();
      const faviconUrl = response.favicon
      ? new URL(`/files/${response.favicon}`, API_URL).toString()
      : "../app/favicon.ico";
    return {
      title: response.data.name_blog || "Blog Padrão",
      description: response.data.description_blog || "Descrição padrão do blog",
      metadataBase: new URL(BLOG_URL!),
      robots: {
        follow: true,
        index: true
      },
      icons: {
        icon: `${faviconUrl}`
      },
      openGraph: {
        title: response.data.name_blog || "Blog Padrão",
        description: response.data.description_blog || "Descrição padrão do blog",
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: response.data.name_blog || "Logo do Blog",
        }],
        type: 'website',
        siteName: response.data.name_blog || "Blog",
      },
    };
  } catch {
    return {
      title: "Blog de Notícias",
      description: "As últimas notícias e atualizações",
    };
  }
}

async function getData() {
  const apiClient = setupAPIClient();
  const [banners, sidebar] = await Promise.all([
    apiClient.get(`/marketing_publication/existing_banner?local=Pagina_inicial`),
    apiClient.get(`/marketing_publication/existing_sidebar?local=Pagina_inicial`),
  ]);
  return {
    existing_slide: banners.data || [],
    existing_sidebar: sidebar.data || [],
  };
}

export default async function Home_page() {
  const { existing_slide, existing_sidebar } = await getData();

  return (
    <BlogLayout
      navbar={<Navbar />}
      bannersSlide={existing_slide.length >= 1 && <SlideBanner position="SLIDER" local="Pagina_inicial" />}
      footer={<Footer />}
      existing_sidebar={existing_sidebar.length}
      banners={<PublicationSidebar existing_sidebar={existing_sidebar} />}
    >
      <HomePage />
    </BlogLayout>
  );
}