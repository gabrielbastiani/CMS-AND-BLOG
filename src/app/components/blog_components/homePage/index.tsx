"use client"

import Image from "next/image";
import noImage from '../../../../assets/no-image-icon-6.png';
import { Newsletter } from "../newsletter";
import { useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import Link from "next/link";

interface PostsProps {
    id: string;
    text_post: string;
    author: string;
    title: string;
    slug_title_post: string;
    custom_url: string
    image_post?: string;
    post_like?: number;
    post_dislike?: number;
    status: string;
    publish_at?: string | number | Date;
    comment?: string[];
    created_at: string | number | Date;
    tags?: {
        tag?: {
            slug_tag_name?: string;
        };
    };
    categories?: Array<{
        category?: {
            id: string;
            name_category?: string;
            slug_name_category?: string;
        };
    }>;
}

interface CategoriesProps {
    id: string;
    name_category: string;
    slug_name_category: string;
    image_category: string;
}

const HomePage = () => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [last_posts, setLast_posts] = useState<PostsProps[]>([]);
    const [categories, setCategories] = useState<CategoriesProps[]>([]);
    const [most_view, setMost_view] = useState<PostsProps[]>([]);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function lastposts() {
            try {
                const { data } = await apiClient.get(`/post/articles/blog`);
                const categories = await apiClient.get(`/categories/blog/posts`);
                setCategories(categories.data);
                setLast_posts(data.last_post);
                setMost_view(data.most_views_post);
            } catch (error) {
                console.log(error);
            }
        }
        lastposts();
    }, []);

    const mostViewed = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        title: `Popular Post #${i + 1}`,
        image: `/src/assets/${i + 1}.png`,
    }));

    return (
        <div className="w-full bg-gray-100">
            {/* Últimos Posts */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4 text-black">Últimos Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {last_posts.slice(0, 6).map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
                        >
                            <Link href={`/article/${post.custom_url ? post.custom_url : post.slug_title_post}`}>
                                <Image
                                    src={`${API_URL}files/${post.image_post}`}
                                    alt={post.title}
                                    width={280}
                                    height={80}
                                    quality={100}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                                <h3 className="text-lg font-semibold text-black">{post.title}</h3>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter */}
            <Newsletter />

            {/* Categorias */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4 text-black">Categorias</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative rounded overflow-hidden h-40 shadow hover:shadow-lg transition"
                        >
                            <Link href={`/posts_categories/${category.slug_name_category}`}>
                                {category.image_category ? (
                                    <Image
                                        src={`${API_URL}files/${category.image_category}`}
                                        alt={category.name_category}
                                        width={80}
                                        height={80}
                                        className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                                    />
                                ) : (
                                    <div className="bg-black"></div>
                                )}

                                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                                    <h3 className="text-white text-lg font-bold">{category.name_category}</h3>
                                </div>
                            </Link>
                        </div>

                    ))}
                </div>
            </div>

            {/* Posts Mais Visualizados */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4 text-black">Posts Mais Visualizados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {most_view.slice(0, 8).map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
                        >
                            <Link href={`/article/${post.custom_url ? post.custom_url : post.slug_title_post}`}>
                                <Image
                                    src={`${API_URL}files/${post.image_post}`}
                                    alt={post.title}
                                    width={280}
                                    height={80}
                                    quality={100}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                                <h3 className="text-lg font-semibold text-black">{post.title}</h3>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seção Extra */}
            <div className="w-full bg-gray-100 py-8">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Seção Extra</h2>
                    <p>Adicione algo interessante aqui, como uma call-to-action ou promoções!</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;