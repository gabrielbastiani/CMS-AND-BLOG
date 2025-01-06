import { AuthContextBlog } from "@/contexts/AuthContextBlog";
import { useContext } from "react";

export function Footer() {

    const { configs } = useContext(AuthContextBlog);

    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} {configs?.name_blog}. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}