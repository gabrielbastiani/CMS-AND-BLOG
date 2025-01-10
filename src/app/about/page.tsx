"use client";

import { AuthContextBlog } from "@/contexts/AuthContextBlog";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import { useContext } from "react";
import BlogLayout from "../components/blog_components/blogLayout";
import Image from "next/image";
import mkt from '../../assets/no-image-icon-6.png';

export default function About() {

    const { configs } = useContext(AuthContextBlog);

    return (
        <BlogLayout
            navbar={<Navbar />}
            banners={
                [
                    <Image src={mkt} alt="Banner 1" className="w-full rounded" width={80} height={80} />,
                    <Image src={mkt} alt="Banner 2" className="w-full rounded" width={80} height={80} />
                ]
            }
            children={
                <div className="container mx-auto my-12 px-6">
                    <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        Sobre
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white shadow-lg rounded-lg p-8">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Sobre o autor do blog
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{configs?.about_author_blog}</p>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-8">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Sobre o blog
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{configs?.description_blog}</p>
                        </div>
                    </div>
                </div>
            }
            footer={<Footer />}
        />
    );
}