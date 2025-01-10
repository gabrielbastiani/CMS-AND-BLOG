"use client"

import Image from "next/image";
import mkt from '../../assets/no-image-icon-6.png';
import { setupAPIClient } from "@/services/api";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import BlogLayout from "../components/blog_components/blogLayout";
import { SlideBanner } from "../components/blog_components/slideBanner";

interface Category {
    id: string;
    slug_name_category: string;
    name_category: string;
    description: string;
    image_category: string;
    children: {
        id: string;
        slug_name_category: string;
        name_category: string;
    }[];
}

export default function Posts_categories() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiClient = setupAPIClient();
                const response = await apiClient.get("/categories/blog/posts");
                setCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={<SlideBanner />}
            footer={<Footer />}
            banners={
                [
                    <Image src={mkt} alt="Banner 1" className="w-full rounded" width={80} height={80} />,
                    <Image src={mkt} alt="Banner 2" className="w-full rounded" width={80} height={80} />
                ]
            }
            presentation={
                <section className="bg-gray-800 py-12 text-white text-center">
                    <h1 className="text-3xl font-bold">Todas as categorias</h1>
                    <p className="text-gray-300 mt-2">
                        Explore todas as categorias do blog.
                    </p>
                </section>
            }
            children={
                <div className="container mx-auto my-12 px-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Carregando categorias...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
                                >
                                    {/* Category Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-75 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundImage: `url(${API_URL}files/${category.image_category}` }}
                                    ></div>

                                    {/* Category Content */}
                                    <div className="relative p-6 bg-gradient-to-t from-black via-transparent to-transparent">
                                        <Link
                                            href={`/posts_categories/${category.slug_name_category}`}
                                            className="text-2xl font-bold text-white mb-2"
                                        >
                                            {category.name_category}
                                        </Link>
                                        <p className="text-gray-300 text-sm mb-4">
                                            {category.description?.length > 100
                                                ? `${category.description.slice(0, 100)}...`
                                                : category.description}
                                        </p>
                                        {/* Subcategories */}
                                        <ul className="mt-4">
                                            {category.children.length >= 1 ? (
                                                <li className="text-red-400">SUBCATEGORIAS:</li>
                                            ) : null}
                                            {category.children.map((subcategory) => (
                                                <li key={subcategory.id}>
                                                    <Link
                                                        href={`/posts_categories/${subcategory.slug_name_category}`}
                                                        className="text-backgroundButton hover:underline"
                                                    >
                                                        {subcategory.name_category}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
        />
    )
}