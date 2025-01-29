"use client";

import BlogLayout from "../components/blog_components/blogLayout";
import ContactForm from "../components/blog_components/contactForm";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import Image from "next/image";
import mkt from '../../assets/no-image-icon-6.png';
import MarketingPopup from "../components/blog_components/popups/marketingPopup";
import { useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { SlideBanner } from "../components/blog_components/slideBanner";

export default function Contact() {

    const [existing_slide, setExisting_slide] = useState<any[]>([]);
    const [existing_sidebar, setExisting_sidebar] = useState<any[]>([]);

    useEffect(() => {
        const contentArticle = async () => {
            const apiClient = setupAPIClient();
            try {
                const response = await apiClient.get(`/marketing_publication/existing_banner?local=Pagina_contato`);
                const response_data = await apiClient.get(`/marketing_publication/existing_sidebar?local=Pagina_contato`);
                setExisting_sidebar(response_data?.data || []);
                setExisting_slide(response?.data || []);
            } catch (error) {
                console.error(error);
            }
        };
        contentArticle();
    }, []);

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={
                <>
                    {existing_slide.length >= 1 ?
                        <SlideBanner position="SLIDER" local="Pagina_contato" />
                        :
                        null
                    }
                </>
            }
            existing_sidebar={existing_sidebar.length}
            banners={
                [
                    <Image src={mkt} alt="Banner 1" className="w-full rounded" width={80} height={80} />,
                    <Image src={mkt} alt="Banner 2" className="w-full rounded" width={80} height={80} />
                ]
            }
            children={
                <>
                    <ContactForm />
                    <MarketingPopup
                        position="POPUP"
                        local="Pagina_contato"
                    />
                </>
            }
            footer={<Footer />}
        />
    )
}