"use client"

import BlogLayout from "./components/blog_components/blogLayout";
import { Footer } from "./components/blog_components/footer";
import { Navbar } from "./components/blog_components/navbar";
import { SlideBanner } from "./components/blog_components/slideBanner";
import HomePage from "./components/blog_components/homePage";
import { useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import PublicationSidebar from "./components/blog_components/publicationSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export default function Home_page() {

  const [existing_slide, setExisting_slide] = useState<any[]>([]);
  const [existing_sidebar, setExisting_sidebar] = useState<any[]>([]);

  useEffect(() => {
    const contentArticle = async () => {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get(`/marketing_publication/existing_banner?local=Pagina_inicial`);
        const { data } = await apiClient.get(`/marketing_publication/existing_sidebar?local=Pagina_inicial`);
        setExisting_sidebar(data || []);
        setExisting_slide(response?.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    contentArticle();
  }, []);

  return (
    <BlogLayout
      navbar={<Navbar />}
      bannersSlide={<>
        {existing_slide.length >= 1 ?
          <SlideBanner position="SLIDER" local="Pagina_inicial" />
          :
          null}
      </>}
      footer={<Footer />}
      existing_sidebar={existing_sidebar.length}
      banners={
        <PublicationSidebar existing_sidebar={existing_sidebar} />
      }
      children={<HomePage />}
    />
  )
}