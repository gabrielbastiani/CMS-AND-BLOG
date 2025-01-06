"use client";

import ContactForm from "../components/blog_components/contactForm";
import { Container_page } from "../components/blog_components/container_page";
import { Footer } from "../components/blog_components/footer";
import { Navbar } from "../components/blog_components/navbar";

export default function Contact() {


    return (
        <Container_page>
            <Navbar />

                <ContactForm />

            <Footer />
        </Container_page>
    )
}