"use client"

import { Footer } from "@/app/components/blog_components/footer";
import { Navbar } from "@/app/components/blog_components/navbar";
import { setupAPIClient } from "@/services/api";
import { Metadata } from "next";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${API_URL}configuration_blog/get_configs`);
    const data = await response.json();

    return {
      title: data.name_blog || "Blog",
      description: data.name_blog || "Blog",
    };
  } catch (error) {
    console.error("Erro ao buscar metadados:", error);
    return {
      title: "Blog",
      description: "Blog",
    };
  }
}
 */
export default function PostPage({ params }: { params: { post_id: string } }) {

  useEffect(() => {
    const updateViews = async () => {
      const apiClient = setupAPIClient();
      try {
        await apiClient.patch(`/post/${params.post_id}/views`);
      } catch (error) {
        console.error("Failed to update views:", error);
      }
    };

    updateViews();
  }, [params.post_id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto flex flex-col md:flex-row gap-8 mt-6">
        <article className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{ }</h1>
          <p className="text-gray-600 mb-6">{ }</p>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-center">
            <p>Anúncio Publicitário</p>
          </div>
        </article>
        <aside className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Publicidade</h3>
          <img src="/images/ad1.jpg" alt="Publicidade" className="rounded-md mb-4" />
          <img src="/images/ad2.jpg" alt="Publicidade" className="rounded-md" />
        </aside>
      </main>
      <Footer />
    </div>
  );
}