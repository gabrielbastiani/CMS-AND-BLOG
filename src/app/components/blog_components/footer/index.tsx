"use client";

import { useContext } from "react";
import { AuthContextBlog } from "@/contexts/AuthContextBlog";

export function Footer() {

    const { configs } = useContext(AuthContextBlog);

    return (
        <footer className="bg-gray-800 text-white py-6 mt-14">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} {configs?.name_blog}. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}