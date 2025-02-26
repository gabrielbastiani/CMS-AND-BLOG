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
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const apiClient = setupAPIClient();
        const { data } = await apiClient.get('/configuration_blog/get_configs');

        const previousImages = (await parent).openGraph?.images || [];
        const imageUrl = previousImages
            ? new URL(`/files/${previousImages}`, API_URL).toString()
            : new URL("../../assets/no-image-icon-6.png", BLOG_URL).toString();
            const faviconUrl = response.favicon
            ? new URL(`/files/${response.favicon}`, API_URL).toString()
            : "../app/favicon.ico";

        return {
            title: data?.name_blog || "Contato - Fale Conosco",
            description: data?.description_blog || "Entre em contato conosco para tirar dúvidas, dar sugestões ou solicitar informações",
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: `${faviconUrl}`
              },
            openGraph: {
                title: data.og_title || `Entre em contato com o nosso blog`,
                description: data.og_description || `Entre em contato com o nosso blog...`,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: data.image_alt || `Contato`,
                    },
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: 'Nome do Seu Site',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data.twitter_title || `Entre em contato com o nosso blog`,
                description: data.twitter_description || `Entre em contato com o nosso blog...`,
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
            keywords: data?.keywords || [
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