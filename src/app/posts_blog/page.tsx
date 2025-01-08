"use client";

import Link from "next/link";
import { Container_page } from "../components/blog_components/container_page";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";

export default function Posts_blog() {
    const posts = [
        {
            id: 1,
            banner: "/images/post1.jpg",
            title: "Como a tecnologia está mudando o mundo",
            tags: ["Inovação", "Tecnologia"],
            categories: [
                { id: 1, name: "Tecnologia", slug: "tecnologia" },
                { id: 2, name: "Inovação", slug: "inovacao" },
            ],
            date: "2025-01-07",
            excerpt:
                "A tecnologia tem desempenhado um papel crucial na transformação de diversos setores ao redor do mundo. Neste artigo, exploramos como...",
            author: "João Silva",
        },
        {
            id: 2,
            banner: "/images/post2.jpg",
            title: "Dicas para uma vida saudável",
            tags: ["Saúde", "Bem-estar"],
            categories: [
                { id: 3, name: "Saúde", slug: "saude" },
            ],
            date: "2025-01-06",
            excerpt:
                "Manter uma vida saudável exige dedicação e conhecimento. Neste post, apresentamos dicas valiosas para melhorar sua saúde...",
            author: "Maria Oliveira",
        },
        // Adicione mais posts aqui
    ];

    return (
        <Container_page>
            <Navbar />

            {/* Section Header */}
            <header className="bg-gray-800 py-12 text-white text-center">
                <h1 className="text-3xl font-bold">Todos os Artigos do Blog</h1>
                <p className="text-gray-300 mt-2">
                    Explore os últimos artigos e fique por dentro das novidades.
                </p>
            </header>

            {/* Artigos Section */}
            <section className="container mx-auto my-12 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            {/* Artigo Banner */}
                            <img
                                src={post.banner}
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
                                    <span>Publicado em: {new Date(post.date).toLocaleDateString()}</span>
                                </div>

                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {post.categories.map((category) => (
                                        <a
                                            key={category.id}
                                            href={`/categories/${category.slug}`}
                                            className="text-xs bg-green-100 text-green-600 py-1 px-2 rounded-full hover:bg-green-200"
                                        >
                                            {category.name}
                                        </a>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className="flex gap-2 mt-2">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs bg-blue-100 text-blue-600 py-1 px-2 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Excerpt */}
                                <p className="text-gray-600 text-sm mt-4">
                                    {post.excerpt.length > 120
                                        ? `${post.excerpt.slice(0, 120)}...`
                                        : post.excerpt}
                                </p>

                                {/* Author */}
                                <div className="mt-4 text-gray-500 text-sm">
                                    <p>Por: {post.author}</p>
                                </div>

                                {/* Read More Link */}
                                <Link
                                    href={`/posts_blog/post/${post.id}`}
                                    className="block text-blue-600 mt-4 text-center font-semibold"
                                >
                                    Leia mais
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </Container_page>
    );
}