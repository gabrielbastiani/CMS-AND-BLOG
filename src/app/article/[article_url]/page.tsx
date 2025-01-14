"use client";

import mkt from '../../../assets/no-image-icon-6.png';
import BlogLayout from "@/app/components/blog_components/blogLayout";
import { Footer } from "@/app/components/blog_components/footer";
import { Navbar } from "@/app/components/blog_components/navbar";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import { FiClock } from "react-icons/fi";
import Link from 'next/link';
import { Newsletter } from '@/app/components/blog_components/newsletter';
import { CommentsSection } from '@/app/components/blog_components/commentsSection';

interface PostsProps {
  id: string;
  text_post: string;
  author: string;
  title: string;
  slug_title_post: string;
  custom_url: string;
  image_post?: string;
  post_like?: number;
  post_dislike?: number;
  status: string;
  publish_at?: string | number | Date;
  created_at: string | number | Date;
  tags?: Array<{
    tag?: {
      id: string;
      tag_name?: string;
      slug_tag_name?: string;
    };
  }>;
  categories?: Array<{
    category?: {
      id: string;
      name_category?: string;
      slug_name_category?: string;
    };
  }>;
  comment?: Array<{
    id: string;
    post_id: string;
    userBlog_id: string;
    userBlog: any;
    comment: string;
    replies: any;
    comment_like: number;
    comment_dislike: number;
    created_at: string | number | Date;
  }>
}

export default function Article({ params }: { params: { article_url: string } }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [article_data, setArticle_data] = useState<PostsProps>();

  useEffect(() => {
    const updateViews = async () => {
      const apiClient = setupAPIClient();
      try {
        const { data } = await apiClient.get(`/post/article/content?url_post=${params.article_url}`);
        setArticle_data(data);
      } catch (error) {
        console.error("Failed to update views:", error);
      }
    };
    updateViews();
  }, [params.article_url]);

  const calculateReadingTime = (text: string): string => {
    const wordsPerMinute = 200; // Média de palavras lidas por minuto
    const words = text.split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return `${readingTime} min de leitura`;
  };

  // Função para lidar com o envio do comentário
  const handleCommentSubmit = (comment: string) => {
    // Lógica para enviar o comentário (ex: chamar API para salvar o comentário)
    console.log("Comentário enviado:", comment);
  };

  return (
    <BlogLayout
      navbar={<Navbar />}
      footer={<Footer />}
      banners={
        [
          <Image src={mkt} alt="Banner 1" className="w-full rounded" width={80} height={80} />,
          <Image src={mkt} alt="Banner 2" className="w-full rounded" width={80} height={80} />
        ]
      }
      bannersSlide={
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
          {article_data?.image_post ? (
            <Image
              src={`${API_URL}files/${article_data.image_post}`}
              alt={article_data.title || "Imagem do artigo"}
              className="object-fill w-full h-full"
              width={1200}
              height={800}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Sem imagem disponível
            </div>
          )}
        </div>
      }
      children={
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Título do artigo */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{article_data?.title}</h1>
          <span className='text-gray-600'>Autor: {article_data?.author || "Desconhecido"}</span>
          {/* Data de publicação, categorias e tempo de leitura */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-12 mt-4">
            <div className="flex items-center gap-2">
              <FiClock className="text-lg" />
              <span>
                {new Date(article_data?.publish_at || article_data?.created_at || new Date()).toLocaleDateString()}
              </span>
            </div>
            {article_data?.text_post && (
              <div className="text-sm">
                {calculateReadingTime(article_data.text_post)}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {article_data?.categories?.map((cat) => (
                <Link key={cat.category?.id} href={`/posts_categories/${cat?.category?.slug_name_category}`}>
                  <span
                    key={cat.category?.id}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cat.category?.name_category}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Conteúdo do artigo */}
          <div
            className="prose max-w-none text-gray-800 prose-h1:text-blue-600 prose-p:mb-4 prose-a:text-indigo-500 hover:prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article_data?.text_post || ""),
            }}
          ></div>

          {/* Tags do artigo */}
          {article_data?.tags && article_data?.tags.length > 0 && (
            <div className="mt-10 mb-10">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Tags:</h2>
              <div className="flex flex-wrap gap-2">
                {article_data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag.tag?.tag_name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <CommentsSection
            comments={article_data?.comment || []}
            onSubmitComment={handleCommentSubmit}
          />
          <Newsletter />
        </div>
      }
    />
  );
}