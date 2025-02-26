import Image from "next/image";
import { setupAPIClient } from "@/services/api";
import { Navbar } from "../components/blog_components/navbar";
import { Footer } from "../components/blog_components/footer";
import BlogLayout from "../components/blog_components/blogLayout";
import mkt from '../../assets/no-image-icon-6.png';
import { SlideBanner } from "../components/blog_components/slideBanner";
import MarketingPopup from "../components/blog_components/popups/marketingPopup";
import { Metadata, ResolvingMetadata } from "next";
import ClientWrapper from "./ClientWrapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    const apiClient = setupAPIClient();

    try {
        const { data } = await apiClient.get('/post/articles/seo');
        const previousImages = (await parent).openGraph?.images || [];

        const imageUrl = previousImages
            ? new URL(`/files/${previousImages}`, API_URL).toString()
            : new URL("../../assets/no-image-icon-6.png", BLOG_URL).toString();
            const faviconUrl = response.favicon
            ? new URL(`/files/${response.favicon}`, API_URL).toString()
            : "../app/favicon.ico";

        return {
            title: "Todos os Artigos",
            description: "Explore nossa coleção completa de artigos e conteúdos exclusivos",
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: `${faviconUrl}`
              },
            openGraph: {
                title: data.og_title || "Todos os Artigos",
                description: data.og_description || "Descubra nossos artigos...",
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: data.image_alt || 'Artigos',
                    },
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: 'Nome do Seu Site',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data.twitter_title || "Todos os Artigos",
                description: data.twitter_description || "Descubra nossos artigos...",
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
            keywords: "artigos, blog, conteúdo, notícias",
        };
    } catch (error) {
        return {
            title: "Artigos",
            description: "Nossa coleção completa de artigos",
        };
    }
}

async function getData() {
    const apiClient = setupAPIClient();

    const [postsResponse, bannersResponse, sidebarResponse] = await Promise.all([
        apiClient.get(`/post/articles/blog`),
        apiClient.get(`/marketing_publication/existing_banner?local=Pagina_todos_artigos`),
        apiClient.get(`/marketing_publication/existing_sidebar?local=Pagina_todos_artigos`),
    ]);

    return {
        all_posts: postsResponse.data.posts,
        totalPages: postsResponse.data.totalPages,
        existing_slide: bannersResponse.data || [],
        existing_sidebar: sidebarResponse.data || [],
    };
}

export default async function Posts_blog() {
    const { all_posts, totalPages, existing_slide, existing_sidebar } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={existing_slide.length >= 1 && <SlideBanner position="SLIDER" local="Pagina_todos_artigos" />}
            footer={<Footer />}
            existing_sidebar={existing_sidebar.length}
            banners={[
                <Image src={mkt} alt="Banner 1" className="w-full rounded" width={80} height={80} priority />,
                <Image src={mkt} alt="Banner 2" className="w-full rounded" width={80} height={80} priority />
            ]}
            presentation={
                <section className="bg-gray-800 py-12 text-white text-center">
                    <h1 className="text-3xl font-bold">Todos os artigos</h1>
                    <p className="text-gray-300 mt-2">
                        Explore todos os artigos do blog.
                    </p>
                </section>
            }
        >
            <ClientWrapper
                all_posts={all_posts}
                totalPages={totalPages}
            />
            <MarketingPopup position="POPUP" local="Pagina_todos_artigos" />
        </BlogLayout>
    );
}