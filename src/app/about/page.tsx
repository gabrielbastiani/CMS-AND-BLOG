import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import BlogLayout from "../components/blog_components/blogLayout";
import MarketingPopup from "../components/blog_components/popups/marketingPopup";
import { SlideBanner } from "../components/blog_components/slideBanner";
import { setupAPIClient } from "@/services/api";
import PublicationSidebar from "../components/blog_components/publicationSidebar";
import { Metadata, ResolvingMetadata } from "next";

const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const apiClient = setupAPIClient();
        const { data: configs } = await apiClient.get('/configs/blog');

        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: `Sobre - ${configs?.title_blog || 'Nosso Blog'}`,
            description: configs?.description_blog || 'Conheça mais sobre nossa plataforma e autores',
            metadataBase: new URL(BLOG_URL!),
            openGraph: {
                title: `Sobre - ${configs?.title_blog || 'Nosso Blog'}`,
                description: configs?.about_author_blog || 'Descubra mais sobre nossa missão e valores',
                images: [
                    {
                        url: configs?.og_image ?
                            `${BLOG_URL}/images/${configs.og_image}` :
                            `${BLOG_URL}/../../../assets/no-image-icon-6.png`,
                        width: 1200,
                        height: 630,
                        alt: configs?.title_blog || 'Sobre nós',
                    },
                    ...previousImages,
                ],
                type: 'website',
            },
            keywords: [
                'sobre',
                'quem somos',
                'autor',
                'história',
                ...(configs?.keywords?.split(',') || [])
            ],
        };
    } catch (error) {
        return {
            title: "Sobre Nós",
            description: "Conheça mais sobre nossa plataforma e equipe",
        };
    }
}

async function getData() {
    const apiClient = setupAPIClient();

    try {
        const [configs, banners, sidebar] = await Promise.all([
            apiClient.get('/configuration_blog/get_configs'),
            apiClient.get('/marketing_publication/existing_banner?local=Pagina_sobre'),
            apiClient.get('/marketing_publication/existing_sidebar?local=Pagina_sobre')
        ]);

        return {
            configs: configs.data,
            existing_slide: banners.data || [],
            existing_sidebar: sidebar.data || [],
        };
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        return {
            configs: null,
            existing_slide: [],
            existing_sidebar: [],
        };
    }
}

export default async function About() {
    const { configs, existing_slide, existing_sidebar } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={existing_slide.length >= 1 && <SlideBanner position="SLIDER" local="Pagina_sobre" />}
            existing_sidebar={existing_sidebar.length}
            banners={<PublicationSidebar existing_sidebar={existing_sidebar} />}
            footer={<Footer />}
        >
            <div className="container mx-auto my-12 px-6">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Sobre
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            Sobre o autor do blog
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {configs?.about_author_blog || 'Nossos autores são especialistas dedicados a trazer o melhor conteúdo.'}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            Sobre o blog
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {configs?.description_blog || 'Um espaço dedicado a compartilhar conhecimento e experiências relevantes.'}
                        </p>
                    </div>
                </div>
            </div>
            <MarketingPopup
                position="POPUP"
                local="Pagina_sobre"
            />
        </BlogLayout>
    );
}