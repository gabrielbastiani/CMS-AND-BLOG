import { setupAPIClient } from "@/services/api";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

interface ReactionPostProps {
    post_id: string;
    like: number;
    deslike: number;
}

export default function ArticleLikeDislike({
    post_id,
    like: initialLike,
    deslike: initialDislike,
}: ReactionPostProps) {
    const [like, setLike] = useState(initialLike);
    const [dislike, setDislike] = useState(initialDislike);
    const [loading, setLoading] = useState(false);

    async function fetchUpdatedReactions() {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get(
                `/post/reload_data?post_id=${post_id}`
            );
            const { post_like: updatedLike, post_dislike: updatedDislike } = response.data;
            setLike(updatedLike);
            setDislike(updatedDislike);
        } catch (error) {
            toast.error("Erro ao atualizar as reações.");
            console.error(error);
        }
    }

    const handleLikeDislike = async (isLike: boolean) => {
        if (loading) return; // Evita múltiplas requisições simultâneas
        setLoading(true);

        try {
            const apiClient = setupAPIClient();
            await apiClient.patch(`/post/likes`, {
                post_id: post_id,
                isLike,
            });
            await fetchUpdatedReactions(); // Atualiza os dados reais
        } catch (error) {
            toast.error("Erro ao registrar sua reação.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!post_id || post_id.length === 0) {
            console.error("Post ID inválido ou não fornecido.");
            return;
        }
        fetchUpdatedReactions();
    }, [post_id]);


    return (
        <div className="flex flex-col items-center mt-8 space-y-4">
            <h2 className="text-lg font-bold text-gray-700">
                Gostou ou não do conteúdo?
            </h2>
            <div className="flex items-center gap-6">
                <button
                    onClick={() => handleLikeDislike(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-hoverButtonBackground hover:text-white"
                        }`}
                    disabled={loading}
                >
                    <FaThumbsUp className="text-xl" />
                    <span className="font-medium">{like}</span>
                </button>
                <button
                    onClick={() => handleLikeDislike(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
                        }`}
                    disabled={loading}
                >
                    <FaThumbsDown className="text-xl" />
                    <span className="font-medium">{dislike}</span>
                </button>
            </div>
        </div>
    );
}