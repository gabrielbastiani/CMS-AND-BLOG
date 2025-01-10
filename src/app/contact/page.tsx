"use client";

import BlogLayout from "../components/blog_components/blogLayout";
import ContactForm from "../components/blog_components/contactForm";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";
import Image from "next/image";
import mkt from '../../assets/no-image-icon-6.png';

export default function Contact() {
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
                <ContactForm />
            }
            footer={<Footer />}
        />
    )
}