"use client"

import Image from "next/image";
import mkt from '../../../../assets/no-image-icon-6.png';
import { Newsletter } from "../newsletter";

const HomePage = () => {

    const posts = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Post #${i + 1}`,
        image: `/src/assets/${i + 1}.png`,
    }));

    const categories = [
        { id: 1, name: "Tecnologia", image: { mkt } },
        { id: 2, name: "Esportes", image: { mkt } },
        { id: 3, name: "Viagens", image: { mkt } },
        { id: 4, name: "Negócios", image: { mkt } },
    ];

    const mostViewed = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        title: `Popular Post #${i + 1}`,
        image: `/src/assets/${i + 1}.png`,
    }));

    return (
        <div className="w-full bg-gray-100">
            {/* Últimos Posts */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Últimos Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
                        >
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={80}
                                height={80}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter */}
            <Newsletter />

            {/* Categorias */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Categorias</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative rounded overflow-hidden h-40 shadow hover:shadow-lg transition"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={80}
                                height={80}
                                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
                                <h3 className="text-white text-lg font-bold">{category.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts Mais Visualizados */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Posts Mais Visualizados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mostViewed.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
                        >
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={80}
                                height={80}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3 className="text-lg font-semibold">{post.title}</h3>
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