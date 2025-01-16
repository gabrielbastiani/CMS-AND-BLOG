"use client"

import { setupAPIClient } from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

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

export default function Most_posts_views() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [most_view, setMost_view] = useState<PostsProps[]>([]);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function lastposts() {
            try {
                const { data } = await apiClient.get(`/post/articles/blog`);
                setMost_view(data.most_views_post);
            } catch (error) {
                console.log(error);
            }
        }
        lastposts();
    }, []);

    return (
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
    )
}