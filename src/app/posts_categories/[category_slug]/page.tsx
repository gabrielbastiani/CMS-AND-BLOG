import BlogLayout from "@/app/components/blog_components/blogLayout";
import { Footer } from "@/app/components/blog_components/footer";
import { Navbar } from "@/app/components/blog_components/navbar";
import { SlideBanner } from "@/app/components/blog_components/slideBanner";
import { setupAPIClient } from "@/services/api";
import MarketingPopup from "@/app/components/blog_components/popups/marketingPopup";
import PublicationSidebar from "@/app/components/blog_components/publicationSidebar";
import { Metadata, ResolvingMetadata } from "next";
import ClientWrapper from "../ClientWrapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    { params }: { params: { category_slug: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const apiClient = setupAPIClient();
        const { data } = await apiClient.get(`/category/seo?slug=${params.category_slug}`);

        const previousImages = (await parent).openGraph?.images || [];
        const imageUrl = previousImages
            ? new URL(`/files/${previousImages}`, API_URL).toString()
            : new URL("../../assets/no-image-icon-6.png", BLOG_URL).toString();
            const faviconUrl = response.favicon
            ? new URL(`/files/${response.favicon}`, API_URL).toString()
            : "../app/favicon.ico";

        const categoryName = data.name_category || "Categoria";

        return {
            title: `${categoryName} - Artigos`,
            description: `Explore todos os artigos da categoria ${categoryName}`,
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: `${faviconUrl}`
              },
            openGraph: {
                title: data.og_title || `Todos os Artigos da categoria ${categoryName}`,
                description: data.og_description || `Descubra nossos artigos na categoris ${categoryName}...`,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: data.image_alt || `Categoria ${categoryName}`,
                    },
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: 'Nome do Seu Site',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data.twitter_title || `Todos os Artigos da categoria ${categoryName}`,
                description: data.twitter_description || `Descubra nossos artigos na categoria ${categoryName}...`,
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
            keywords: [
                categoryName,
                ...(data.keywords || []),
                "artigos",
                "conteúdo",
                "blog"
            ],
            alternates: {
                canonical: `/posts_categories/${params.category_slug}`,
            },
        };
    } catch (error) {
        return {
            title: "Categoria de Artigos",
            description: "Explore nossos artigos por categoria",
        };
    }
}

async function getData(category_slug: string) {
    const apiClient = setupAPIClient();

    try {
        const [bannersResponse, sidebarResponse, categoryResponse] = await Promise.all([
            apiClient.get(`/marketing_publication/existing_banner?local=Pagina_categoria`).catch(e => {
                console.error("Erro em banners:", e.response?.status, e.config?.url);
                return { data: [] };
            }),
            apiClient.get(`/marketing_publication/existing_sidebar?local=Pagina_categoria`).catch(e => {
                console.error("Erro em sidebar:", e.response?.status, e.config?.url);
                return { data: [] };
            }),
            apiClient.get(`/category/data_category?slug_name_category=${category_slug}`).catch(e => {
                console.error("Erro em categoria:", e.response?.status, e.config?.url);
                return { data: {} };
            }),
        ]);

        return {
            loadData: categoryResponse.data,
            all_posts: [],
            totalPages: 0,
            existing_slide: bannersResponse.data || [],
            existing_sidebar: sidebarResponse.data || [],
        };

    } catch (error) {
        console.error("Erro geral:", error);
        return {
            loadData: null,
            all_posts: [],
            totalPages: 0,
            existing_slide: [],
            existing_sidebar: [],
        };
    }
}

export default async function Posts_Categories({ params }: { params: { category_slug: string } }) {
    const { loadData, all_posts, totalPages, existing_slide, existing_sidebar } = await getData(params.category_slug);

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={existing_slide.length >= 1 && <SlideBanner position="SLIDER" local="Pagina_categoria" />}
            footer={<Footer />}
            existing_sidebar={existing_sidebar.length}
            banners={<PublicationSidebar existing_sidebar={existing_sidebar} />}
            presentation={
                <section className="bg-gray-800 py-12 text-white text-center">
                    <h1 className="text-3xl font-bold">{`Artigos de ${loadData?.name_category}`}</h1>
                    <p className="text-gray-300 mt-2">
                        {`Explore todos artigos da categoria ${loadData?.name_category}.`}
                    </p>
                </section>
            }
        >
            <ClientWrapper
                category_slug={params.category_slug}
                initialPosts={all_posts}
                totalPages={totalPages}
            />
            <MarketingPopup position="POPUP" local="Pagina_categoria" />
        </BlogLayout>
    );
}