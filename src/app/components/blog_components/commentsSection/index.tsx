"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { AuthContextBlog } from "@/contexts/AuthContextBlog";
import no_user from "../../../../assets/no-user.jpg";
import { ModalLogin } from "../popups/modalLogin";
import { ModalEditUser } from "../popups/modalEditUser";
import { ModalCreateUser } from "../popups/modalCreateUser";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

interface CommentsProps {
    id: string;
    post_id: string;
    userBlog_id: string;
    userBlog: any;
    name_user: string;
    image_user: string;
    comment: string;
    replies: CommentsProps[];
    comment_like: number;
    comment_dislike: number;
    created_at: string | number | Date;
}

interface CommentProps {
    post_id: string;
}

export function CommentsSection({ post_id }: CommentProps) {
    const { isAuthenticated, user } = useContext(AuthContextBlog);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!RECAPTCHA_SITE_KEY) {
        throw new Error(
            "A variável NEXT_PUBLIC_RECAPTCHA_SITE_KEY não está definida."
        );
    }

    const [comments, setComments] = useState<CommentsProps[]>([]);
    const [likes, setLikes] = useState<{ [key: string]: number }>({});
    const [dislikes, setDislikes] = useState<{ [key: string]: number }>({});
    const [newComment, setNewComment] = useState<string>("");

    const [replyComment, setReplyComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const [modalLogin, setModalLogin] = useState(false);
    const [modalEditUser, setModalEditUser] = useState(false);
    const [modalCreateUser, setModalCreateUser] = useState(false);

    useEffect(() => {
        async function loadCommentsPost() {
            try {
                const apiClient = setupAPIClient();
                const response = await apiClient.get(
                    `/comment/get_comments/post?post_id=${post_id}`
                );
                setComments(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        loadCommentsPost();
    }, [post_id]);

    const handleLikeDislike = async (id: string, isLike: boolean) => {
        try {
            const apiClient = setupAPIClient();
            const { data } = await apiClient.post(`/comment/like`, {
                comment_id: id,
                isLike,
            });

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === id
                        ? {
                            ...comment,
                            comment_like: data.comment_like,
                            comment_dislike: data.comment_dislike,
                        }
                        : comment
                )
            );
        } catch (error) {
            toast.error("Erro ao registrar sua reação.");
            console.error(error);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            const apiClient = setupAPIClient();
            await apiClient.post(`/comment/create_comment`, {
                post_id,
                userBlog_id: user?.id,
                name_user: user?.name,
                image_user: user?.image_user,
                comment: newComment,
            });
            setNewComment("");
            toast.success("Comentário enviado!");
        } catch (error) {
            toast.error("Erro ao enviar o comentário!");
            console.error(error);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyComment || !replyingTo) return;

        try {
            const apiClient = setupAPIClient();
            const { data: newReply } = await apiClient.post(`/comment/create_comment`, {
                post_id,
                userBlog_id: user?.id,
                name_user: user?.name,
                image_user: user?.image_user,
                comment: replyComment,
                parentId: replyingTo,
            });

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === replyingTo
                        ? {
                            ...comment,
                            replies: [...(comment.replies || []), newReply],
                        }
                        : comment
                )
            );

            setReplyComment("");
            setReplyingTo(null);
            toast.success("Resposta enviada!");
        } catch (error) {
            toast.error("Erro ao enviar resposta.");
            console.error(error);
        }
    };


    return (
        <>
            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Comentários:</h2>
                {isAuthenticated ? (
                    <div className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                            className="w-full p-4 border border-gray-300 rounded-md text-black"
                            placeholder="Escreva seu comentário..."
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full"
                        >
                            Enviar Comentário
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 flex flex-col">
                        <p className="text-gray-600 mb-4">Faça login para deixar um comentário.</p>
                        <button
                            onClick={() => setModalLogin(true)}
                            className="mb-6 px-6 py-2 bg-green-600 text-white rounded-full w-1/2"
                        >
                            Fazer Login
                        </button>

                        <button
                            onClick={() => setModalCreateUser(true)}
                            className="px-6 py-2 bg-red-500 text-white rounded-full w-1/2"
                        >
                            Não tem uma conta ainda? Clique aqui!
                        </button>
                    </div>
                )}

                {comments.length > 0 ? (
                    <>
                        {comments.map((comment: any) => (
                            <div key={comment.id} className="mb-4">
                                <div className="flex items-start gap-4">
                                    <Image
                                        src={comment.image_user ? `${API_URL}files/${comment.image_user}` : no_user}
                                        alt={comment.name_user}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">{comment.name_user}</span>{" "}
                                            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="mt-1 text-gray-800">{comment.comment}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <button
                                                onClick={() => handleLikeDislike(comment.id, true)}
                                                className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
                                            >
                                                <FaThumbsUp /> {likes[comment.id] || comment.comment_like}
                                            </button>
                                            <button
                                                onClick={() => handleLikeDislike(comment.id, false)}
                                                className="text-gray-500 hover:text-red-500 flex items-center gap-1"
                                            >
                                                <FaThumbsDown /> {dislikes[comment.id] || comment.comment_dislike}
                                            </button>
                                            <button
                                                onClick={() => setReplyingTo(comment.id)}
                                                className="text-gray-500 hover:text-green-500 flex items-center gap-1"
                                            >
                                                <FaReply /> Responder
                                            </button>
                                            {replyingTo === comment.id && (
                                                <div className="mt-2">
                                                    <textarea
                                                        value={replyComment}
                                                        onChange={(e) => setReplyComment(e.target.value)}
                                                        rows={2}
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        placeholder="Escreva sua resposta..."
                                                    />
                                                    <button
                                                        onClick={handleReplySubmit}
                                                        className="mt-1 px-4 py-1 bg-blue-500 text-white rounded-md"
                                                    >
                                                        Enviar Resposta
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4">{comment.replies}</div>
                                )}
                            </div>
                        ))}
                    </>
                ) :
                    <p>Nenhum comentário disponível.</p>
                }
            </div>

            <div>
                {modalLogin && <ModalLogin onClose={() => setModalLogin(false)} />}
                {modalEditUser && <ModalEditUser onClose={() => setModalEditUser(false)} />}
                {modalCreateUser && <ModalCreateUser onClose={() => setModalCreateUser(false)} loginModal={() => setModalLogin(true)} />}
            </div>
        </>
    );
};