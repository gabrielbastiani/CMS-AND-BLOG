import { setupAPIClient } from "@/services/api";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import Link from "next/link";
import BlogLayout from "../components/blog_components/blogLayout";
import { SlideBanner } from "../components/blog_components/slideBanner";
import MarketingPopup from "../components/blog_components/popups/marketingPopup";
import PublicationSidebar from "../components/blog_components/publicationSidebar";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const apiClient = setupAPIClient();
        const { data } = await apiClient.get('/categories/seo');
        const previousImages = (await parent).openGraph?.images || [];

        const imageUrl = previousImages
            ? new URL(`/files/${previousImages}`, API_URL).toString()
            : new URL("../../assets/no-image-icon-6.png", BLOG_URL).toString();
            const faviconUrl = response.favicon
            ? new URL(`/files/${response.favicon}`, API_URL).toString()
            : "../app/favicon.ico";

        return {
            title: data.title || "Todas as Categorias",
            description: data.description || "Explore nossa coleção completa de categorias de artigos",
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: `${faviconUrl}`
              },
            openGraph: {
                title: data.og_title || "Todas as Categorias",
                description: data.og_description || "Descubra nossas categorias...",
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: data.image_alt || 'Categorias',
                    },
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: 'Nome do Seu Site',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data.twitter_title || "Todas as Categorias",
                description: data.twitter_description || "Descubra nossas categorias...",
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: data.image_alt || 'Artigos',
                    },
                    ...previousImages,
                ],
                creator: '@seu_twitter',
            },
            keywords: data.keywords?.join(', ') || "categorias, tópicos, artigos, blog",
        };
    } catch (error) {
        return {
            title: "Categorias",
            description: "Nossa coleção completa de categorias",
        };
    }
}

async function getData() {
    const apiClient = setupAPIClient();

    const [categoriesResponse, bannersResponse, sidebarResponse] = await Promise.all([
        apiClient.get<Category[]>("/categories/blog/posts"),
        apiClient.get(`/marketing_publication/existing_banner?local=Pagina_todas_categorias`),
        apiClient.get(`/marketing_publication/existing_sidebar?local=Pagina_todas_categorias`),
    ]);

    return {
        categories: categoriesResponse.data,
        existing_slide: bannersResponse.data || [],
        existing_sidebar: sidebarResponse.data || [],
    };
}

export default async function Posts_categories() {
    const { categories, existing_slide, existing_sidebar } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={existing_slide.length >= 1 && <SlideBanner position="SLIDER" local="Pagina_todas_categorias" />}
            footer={<Footer />}
            existing_sidebar={existing_sidebar.length}
            banners={<PublicationSidebar existing_sidebar={existing_sidebar} />}
            presentation={
                <section className="bg-gray-800 py-12 text-white text-center">
                    <h1 className="text-3xl font-bold">Todas as categorias</h1>
                    <p className="text-gray-300 mt-2">
                        Explore todas as categorias do blog.
                    </p>
                </section>
            }
        >
            <div className="container mx-auto my-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-75 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundImage: `url(${API_URL}files/${category.image_category}` }}
                            ></div>

                            <div className="relative p-6 bg-gradient-to-t from-black via-transparent to-transparent">
                                <Link
                                    href={`/posts_categories/${category.slug_name_category}`}
                                    className="text-2xl font-bold text-white mb-2 block"
                                >
                                    {category.name_category}
                                </Link>
                                <p className="text-gray-300 text-sm mb-4">
                                    {category.description?.slice(0, 100)}
                                    {category.description?.length > 100 && "..."}
                                </p>
                                {category.children.length >= 1 && (
                                    <div className="mt-4">
                                        <span className="text-red-400">SUBCATEGORIAS:</span>
                                        <ul className="mt-2">
                                            {category.children.map((subcategory) => (
                                                <li key={subcategory.id} className="mb-1">
                                                    <Link
                                                        href={`/posts_categories/${subcategory.slug_name_category}`}
                                                        className="text-backgroundButton hover:underline text-sm"
                                                    >
                                                        {subcategory.name_category}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <MarketingPopup position="POPUP" local="Pagina_todas_categorias" />
        </BlogLayout>
    );
}

<script type="application/ld+json">
    {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Categorias",
            "item": BLOG_URL + "/posts_categories"
        }]
    })}
</script>