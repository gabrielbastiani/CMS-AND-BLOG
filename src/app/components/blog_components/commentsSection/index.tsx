"use client";

import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";// Usando o NextAuth para gerenciar a sessão
import { AuthContextBlog } from "@/contexts/AuthContextBlog";
import Link from "next/link";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { z } from "zod";
import { Input } from "../../input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUpload } from "react-icons/fi";
import { setupAPIClientBlog } from "@/services/api_blog";

interface CommentProps {
    id: string;
    post_id: string;
    userBlog_id: string;
    userBlog: any;
    comment: string;
    replies?: CommentProps[];
    comment_like: number;
    comment_dislike: number;
    created_at: string | number | Date;
}

interface CommentsSectionProps {
    comments: CommentProps[];
    onSubmitComment: (comment: string) => void;  // Função para enviar o comentário
}

const schema = z.object({
    name: z.string().optional(),
    email: z.string().email("Insira um email válido").optional(),
    password: z.string().optional(),
});

type FormData = z.infer<typeof schema>

export const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onSubmitComment }) => {

    const { signIn, signOut, isAuthenticated, updateUser, loadingAuth, user } = useContext(AuthContextBlog);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!RECAPTCHA_SITE_KEY) {
        throw new Error("A variável NEXT_PUBLIC_RECAPTCHA_SITE_KEY não está definida.");
    }

    const [modalLogin, setModalLogin] = useState<string | null>(null);
    const [likes, setLikes] = useState<{ [key: string]: number }>({});
    const [dislikes, setDislikes] = useState<{ [key: string]: number }>({});
    const [newComment, setNewComment] = useState<string>("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const captchaRef = useRef<ReCAPTCHA | null>(null);
    const [modalEditUser, setModalEditUser] = useState<string | null>(null);
    const [modalCreateUser, setModalCreateUser] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState(
        user?.image_user ? `${API_URL}files/${user.image_user}` : ""
    );
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const handleLike = (id: string) => {
        setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleDislike = (id: string) => {
        setDislikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const renderComments = (comments: CommentProps[], depth = 0) => {
        return comments.map((comment) => (
            <div
                key={comment.id}
                className={`mb-4 border-l-${depth > 0 ? "4" : "0"} border-gray-300 pl-4`}
            >
                <div className="flex items-start gap-4">
                    <Image
                        src={comment.userBlog.image || "/default-avatar.png"}
                        alt={comment.userBlog.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <div className="flex-1">
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">{comment.userBlog.name}</span>{" "}
                            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1 text-gray-800">{comment.comment}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => handleLike(comment.id)}
                                className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
                            >
                                <FaThumbsUp /> {likes[comment.id] || comment.comment_like}
                            </button>
                            <button
                                onClick={() => handleDislike(comment.id)}
                                className="text-gray-500 hover:text-red-500 flex items-center gap-1"
                            >
                                <FaThumbsDown /> {dislikes[comment.id] || comment.comment_dislike}
                            </button>
                            <button
                                className="text-gray-500 hover:text-green-500 flex items-center gap-1"
                            >
                                <FaReply /> Responder
                            </button>
                        </div>
                    </div>
                </div>
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4">{renderComments(comment.replies, depth + 1)}</div>
                )}
            </div>
        ));
    };

    const handleCommentSubmit = () => {
        if (newComment.trim() !== "") {
            onSubmitComment(newComment);
            setNewComment("");  // Limpa o campo após envio
        }
    };

    const onChangeCaptcha = (token: string | null) => {
        setCaptchaToken(token);
    };

    const handleLoginModalClick = () => {
        setModalLogin("id");
    };

    const handleCloseModal = () => {
        setModalLogin(null);
    };

    const handleEditUserCloseModal = () => {
        setModalEditUser(null);
    };

    const handleCreateUserModalClick = () => {
        setModalCreateUser("id");
    };

    const handleCreateUserCloseModal = () => {
        setModalCreateUser(null);
    }

    useEffect(() => {
        if (modalEditUser && user) {
            reset({
                name: user?.name || "",
                email: user?.email || "",
            });
            setAvatarUrl(
                user?.image_user ? `${API_URL}files/${user.image_user}` : ""
            );
        }
    }, [modalEditUser, user, reset]);

    async function onSubmit(data: FormData) {
        if (!captchaToken) {
            toast.error("Por favor, verifique o reCAPTCHA.");
            return;
        }

        const email = data?.email;
        const password = data?.password;

        try {
            let dataUser: any = {
                email,
                password
            };

            await signIn(dataUser);

            handleCloseModal();

        } catch (error) {
            console.error(error);
        }
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        }

        const image = e.target.files[0];
        if (!image) {
            return;
        }

        if (image.type === "image/jpeg" || image.type === "image/png") {
            setPhoto(image);
            setAvatarUrl(URL.createObjectURL(image));
        }
    }

    async function onSubmitEdit(data: FormData) {
        try {
            setLoading(true);

            const apiClientBlog = setupAPIClientBlog();
            const formData = new FormData();

            if (!user) {
                toast.error("Usuário não encontrado!");
                return;
            }

            if (photo) {
                formData.append("file", photo);
            }

            if (data.name !== user.name) {
                formData.append("name", data.name || "");
            }

            if (data.email !== user.email) {
                formData.append("email", data.email || "");
            }

            formData.append("user_id", user.id);

            const response = await apiClientBlog.put("/user/user_blog/update", formData);

            toast.success("Dados atualizados com sucesso!");

            setPhoto(null);

            updateUser({ image_user: response.data.image_user });

            handleEditUserCloseModal();

        } catch (error) {
            toast.error("Erro ao atualizar!");
        } finally {
            setLoading(false);
        }
    }

    async function onSubmitCreate(data: FormData) {
        try {
            setLoading(true);

            const apiClientBlog = setupAPIClientBlog();
            const formData = new FormData();

            if (photo) {
                formData.append("file", photo);
            }

            formData.append("name", data.name || "");
            formData.append("email", data.email || "");

            const response = await apiClientBlog.post("/user/user_blog/create", formData);

            toast.success("Usuario cadastrado com sucesso");

            setPhoto(null);

            handleCreateUserCloseModal();

        } catch (error) {
            toast.error("Erro ao atualizar!");
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Comentários:</h2>

                {/* Verifica se o usuário está logado */}
                {isAuthenticated ? (
                    <div className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                            className="w-full p-4 border border-gray-300 rounded-md"
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
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">Faça login para deixar um comentário.</p>
                        <button
                            onClick={handleLoginModalClick}
                            className="px-6 py-2 bg-green-600 text-white rounded-full"
                        >
                            Fazer Login
                        </button>

                        <button
                            onClick={handleCreateUserModalClick}
                            className="px-6 py-2 bg-red-500 text-white rounded-full"
                        >
                            Não tem uma conta ainda? Clique aqui!
                        </button>
                    </div>
                )}

                {comments.length > 0 ? (
                    renderComments(comments)
                ) : (
                    <p className="text-gray-600">Nenhum comentário disponível.</p>
                )}
            </div>

            <div>
                {modalLogin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-3 text-black">Login</h2>
                            <div className="flex justify-end mt-4 space-x-2">
                                <form
                                    className='bg-white max-w-xl w-full rounded-lg p-4'
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <div className='mb-3'>
                                        <Input
                                            styles='w-full border-2 rounded-md h-11 px-2'
                                            type="email"
                                            placeholder="Digite seu email..."
                                            name="email"
                                            error={errors.email?.message}
                                            register={register}
                                        />
                                    </div>

                                    <div className='mb-3'>
                                        <Input
                                            styles='w-full border-2 rounded-md h-11 px-2'
                                            type="password"
                                            placeholder="Digite sua senha..."
                                            name="password"
                                            error={errors.password?.message}
                                            register={register}
                                        />
                                    </div>

                                    <div className='mb-3'>
                                        <ReCAPTCHA
                                            ref={captchaRef}
                                            sitekey={RECAPTCHA_SITE_KEY}
                                            onChange={onChangeCaptcha}
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type='submit'
                                            className='bg-green-600 w-full rounded-md text-white h-10 font-medium mb-5'
                                        >
                                            Acessar
                                        </button>

                                        <Link
                                            href="/email_recovery_password_user_blog"
                                            className="text-black"
                                        >
                                            Recupere sua senha!
                                        </Link>
                                    </div>

                                    <button
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md mt-5"
                                    >
                                        Cancelar
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                )}
                {modalEditUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-3 text-black">Editar dados</h2>
                            <div className="flex justify-end mt-4 space-x-2">
                                <form
                                    onSubmit={handleSubmit(onSubmitEdit)}
                                    className="flex flex-col space-y-6 w-full max-w-md md:max-w-none"
                                >
                                    <label className="relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full cursor-pointer flex justify-center bg-gray-200 overflow-hidden">
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-300 rounded-full">
                                            <FiUpload size={30} color="#ff6700" />
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFile}
                                            className="hidden"
                                            alt="Foto do usuário"
                                        />
                                        {avatarUrl ? (
                                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                                <Image
                                                    className="object-cover w-full h-full rounded-full"
                                                    src={avatarUrl}
                                                    width={180}
                                                    height={180}
                                                    alt="Foto do usuário"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                                <FiUpload size={30} color="#ff6700" />
                                            </div>
                                        )}
                                    </label>

                                    <Input
                                        styles="border-2 rounded-md h-12 px-3 w-full"
                                        type="text"
                                        placeholder="Digite seu nome completo..."
                                        name="name"
                                        error={errors.name?.message}
                                        register={register}
                                    />

                                    <Input
                                        styles="border-2 rounded-md h-12 px-3 w-full"
                                        type="email"
                                        placeholder="Digite seu email..."
                                        name="email"
                                        error={errors.email?.message}
                                        register={register}
                                    />

                                    <button
                                        type="submit"
                                        className="w-full md:w-80 px-6 py-3 bg-backgroundButton text-white rounded hover:bg-hoverButtonBackground transition duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? "Salvando..." : "Salvar alterações"}
                                    </button>

                                    <button
                                        onClick={signOut}
                                        className="mb-16 mt-24 w-full md:w-80 px-6 py-3 bg-red-600 text-white rounded hover:bg-hoverButtonBackground transition duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? "Saindo..." : "Sair da conta"}
                                    </button>

                                    <button
                                        onClick={handleEditUserCloseModal}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md w-56 cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                 {modalCreateUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-5 rounded shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-3 text-black">Editar dados</h2>
                            <div className="flex justify-end mt-4 space-x-2">
                                <form
                                    onSubmit={handleSubmit(onSubmitCreate)}
                                    className="flex flex-col space-y-6 w-full max-w-md md:max-w-none"
                                >
                                    <label className="relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full cursor-pointer flex justify-center bg-gray-200 overflow-hidden">
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-300 rounded-full">
                                            <FiUpload size={30} color="#ff6700" />
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFile}
                                            className="hidden"
                                            alt="Foto do usuário"
                                        />
                                        {avatarUrl ? (
                                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                                <Image
                                                    className="object-cover w-full h-full rounded-full"
                                                    src={avatarUrl}
                                                    width={180}
                                                    height={180}
                                                    alt="Foto do usuário"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                                <FiUpload size={30} color="#ff6700" />
                                            </div>
                                        )}
                                    </label>

                                    <Input
                                        styles="border-2 rounded-md h-12 px-3 w-full"
                                        type="text"
                                        placeholder="Digite seu nome completo..."
                                        name="name"
                                        error={errors.name?.message}
                                        register={register}
                                    />

                                    <Input
                                        styles="border-2 rounded-md h-12 px-3 w-full"
                                        type="email"
                                        placeholder="Digite seu email..."
                                        name="email"
                                        error={errors.email?.message}
                                        register={register}
                                    />

                                    <button
                                        type="submit"
                                        className="w-full md:w-80 px-6 py-3 bg-backgroundButton text-white rounded hover:bg-hoverButtonBackground transition duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? "Cadastrando..." : "Cadastrar"}
                                    </button>

                                    <button
                                        onClick={handleCreateUserCloseModal}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md w-56 cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};