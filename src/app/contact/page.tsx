import BlogLayout from "../components/blog_components/blogLayout";
import ContactForm from "../components/blog_components/contactForm";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import MarketingPopup from "../components/blog_components/popups/marketingPopup";
import { setupAPIClient } from "@/services/api";
import { SlideBanner } from "../components/blog_components/slideBanner";
import PublicationSidebar from "../components/blog_components/publicationSidebar";
import { Metadata, ResolvingMetadata } from "next";

const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const apiClient = setupAPIClient();
        const { data: seoData } = await apiClient.get('/configuration_blog/get_configs');

        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: seoData?.name_blog || "Contato - Fale Conosco",
            description: seoData?.description_blog || "Entre em contato conosco para tirar dúvidas, dar sugestões ou solicitar informações",
            metadataBase: new URL(BLOG_URL!),
            openGraph: {
                title: seoData?.name_blog || "Contato - Nossa Equipe Está à Sua Disposição",
                description: seoData?.description_blog || "Formas de entrar em contato com nossa equipe e suporte",
                images: [
                    {
                        url: seoData?.logo || `${BLOG_URL}/../../../assets/no-image-icon-6.png`,
                        width: 1200,
                        height: 630,
                        alt: seoData?.name_blog || "Contato",
                    },
                    ...previousImages,
                ],
                type: 'website',
            },
            keywords: seoData?.keywords || [
                'contato',
                'suporte',
                'email',
                'formulário de contato',
                'atendimento'
            ],
        };
    } catch (error) {
        return {
            title: "Contato",
            description: "Entre em contato conosco através de nossos canais de atendimento",
        };
    }
}

async function getData() {
    const apiClient = setupAPIClient();

    try {
        const [banners, sidebar] = await Promise.all([
            apiClient.get('/marketing_publication/existing_banner?local=Pagina_contato'),
            apiClient.get('/marketing_publication/existing_sidebar?local=Pagina_contato')
        ]);

        return {
            existing_slide: banners.data || [],
            existing_sidebar: sidebar.data || [],
        };
    } catch (error) {
        console.error("Erro ao carregar dados de marketing:", error);
        return {
            existing_slide: [],
            existing_sidebar: [],
        };
    }
}

export default async function Contact() {
    const { existing_slide, existing_sidebar } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={existing_slide.length >= 1 && <SlideBanner position="SLIDER" local="Pagina_contato" />}
            existing_sidebar={existing_sidebar.length}
            banners={<PublicationSidebar existing_sidebar={existing_sidebar} />}
            footer={<Footer />}
        >
            <div className="contact-page-container">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    Fale Conosco
                </h1>
                <div className="max-w-2xl mx-auto">
                    <ContactForm />
                </div>
            </div>

            <MarketingPopup
                position="POPUP"
                local="Pagina_contato"
            />
        </BlogLayout>
    );
}