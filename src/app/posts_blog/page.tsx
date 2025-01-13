"use client";

import Link from "next/link";
import Image from "next/image";
import Params_nav_blog from "../components/blog_components/params_nav_blog";
import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import { Navbar } from "../components/blog_components/navbar";
import { Footer } from "../components/blog_components/footer";
import BlogLayout from "../components/blog_components/blogLayout";
import mkt from '../../assets/no-image-icon-6.png';
import { SlideBanner } from "../components/blog_components/slideBanner";

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

export default function Posts_blog() {

    const apiClient = setupAPIClient();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [all_posts, setAll_posts] = useState<PostsProps[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    async function fetchPosts({ page, limit, search, orderBy, orderDirection }: any) {
        try {
            const response = await apiClient.get(`/post/articles/blog`, {
                params: { page, limit, search, orderBy, orderDirection }
            });
            setAll_posts(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    }

    const columnsOrder: any = [
        { key: "title", label: "titulo" },
        { key: "created_at", label: "data" }
    ];

    const availableColumnsOrder: any = [
        "title",
        "created_at"
    ];

    const customNamesOrder: any = {
        title: "titulo",
        created_at: "data"
    };

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
                    <h1 className="text-3xl font-bold">Todas os artogos</h1>
                    <p className="text-gray-300 mt-2">
                        Explore todos os artigos do blog.
                    </p>
                </section>
            }
            children={
                <Params_nav_blog
                    active_buttons_searchInput_notification={false}
                    active_buttons_searchInput_comments={false}
                    customNamesOrder={customNamesOrder}
                    availableColumnsOrder={availableColumnsOrder}
                    columnsOrder={columnsOrder}
                    availableColumns={[]}
                    table_data="post"
                    data={all_posts}
                    totalPages={totalPages}
                    onFetchData={fetchPosts}
                    children={
                        <section className="container mx-auto my-12 px-4 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {all_posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
                                    >
                                        {/* Artigo Banner */}
                                        <img
                                            src={`${API_URL}files/${post.image_post}`}
                                            alt={post.title}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />

                                        {/* Artigo Content */}
                                        <div className="p-4">
                                            {/* Title */}
                                            <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600">
                                                {post.title}
                                            </h2>

                                            {/* Metadata */}
                                            <div className="text-sm text-gray-500 mt-2">
                                                <span>Publicado em: {new Date(post.publish_at ? post.publish_at : post.created_at).toLocaleDateString()}</span>
                                            </div>

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {post.categories?.map((cat) => (
                                                    <Link
                                                        key={cat.category?.id}
                                                        href={`/posts_categories/${cat.category?.slug_name_category}`}
                                                        className="text-xs bg-green-100 text-green-600 py-1 px-2 rounded-full hover:bg-green-200"
                                                    >
                                                        {cat.category?.name_category}
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Array.isArray(post.tags) &&
                                                    post.tags.map((ta, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs bg-blue-100 text-orange-500 py-1 px-2 rounded-full"
                                                        >
                                                            #{ta.tag?.slug_tag_name}
                                                        </span>
                                                    ))}
                                            </div>

                                            {/* Text */}
                                            <p className="text-gray-600 text-sm mt-4">
                                                {post.text_post.length > 120
                                                    ? `${post.text_post.slice(0, 120)}...`
                                                    : post.text_post}
                                            </p>

                                            {/* Author */}
                                            <div className="mt-4 text-gray-500 text-sm">
                                                <p>Por: {post.author}</p>
                                            </div>

                                            {/* Read More Link */}
                                            <Link
                                                href={`/posts_blog/post/${post.custom_url ? post.custom_url : post.slug_title_post}`}
                                                className="block text-red-600 mt-4 text-center font-semibold"
                                            >
                                                Leia mais
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    }
                />
            }
        />
    );
}