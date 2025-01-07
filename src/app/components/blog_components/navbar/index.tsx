"use client"

import Link from "next/link";
import Image from "next/image";
import { FiLogIn, FiMenu, FiUpload, FiUser } from "react-icons/fi";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { AuthContextBlog } from "@/contexts/AuthContextBlog";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../input";
import { setupAPIClientBlog } from "@/services/api_blog";

const schema = z.object({
    name: z.string().optional(),
    email: z.string().email("Insira um email válido").optional(),
    password: z.string().optional(),
});

type FormData = z.infer<typeof schema>

export function Navbar() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!RECAPTCHA_SITE_KEY) {
        throw new Error("A variável NEXT_PUBLIC_RECAPTCHA_SITE_KEY não está definida.");
    }

    const { signIn, isAuthenticated, loadingAuth, user, configs, updateUser, signOut } = useContext(AuthContextBlog);

    const [modalLogin, setModalLogin] = useState<string | null>(null);
    const [modalEditUser, setModalEditUser] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState(
        user?.image_user ? `${API_URL}files/${user.image_user}` : ""
    );
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const captchaRef = useRef<ReCAPTCHA | null>(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    });

    const onChangeCaptcha = (token: string | null) => {
        setCaptchaToken(token);
    };

    const handleLoginModalClick = () => {
        setModalLogin("id");
    };

    const handleCloseModal = () => {
        setModalLogin(null);
    };

    const handleEditUserModalClick = () => {
        setModalEditUser("id");
    };

    const handleEditUserCloseModal = () => {
        setModalEditUser(null);
    };

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

    return (
        <header className="bg-black shadow-md sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center py-2 px-2 md:px-8">
                {/* Logo */}
                <Link href="/">
                    <Image
                        src={`${API_URL}files/${configs?.logo}`}
                        width={120}
                        height={120}
                        alt="logo"
                        className="w-20 h-20 md:w-28 md:h-28 object-contain mr-14"
                    />
                </Link>

                {/* Menu para dispositivos móveis */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-var(--foreground) focus:outline-none"
                    >
                        <FiMenu size={28} />
                    </button>
                </div>

                {/* Lista de links */}
                <ul
                    className={`absolute top-full left-0 w-full bg-black shadow-md p-4 flex flex-col gap-4 items-center md:static md:flex md:flex-row md:gap-6 md:shadow-none md:bg-transparent ${isMobileMenuOpen ? "block" : "hidden"
                        }`}
                >
                    <li>
                        <Link href="/categories" className="hover:text-hoverButtonBackground">
                            Categorias
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="hover:text-hoverButtonBackground">
                            Contato
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="hover:text-hoverButtonBackground">
                            Sobre
                        </Link>
                    </li>

                    {/* Ícone de usuário ou login - Mobile */}
                    <li className="md:hidden">
                        {!loadingAuth && isAuthenticated ? (
                            <button onClick={handleEditUserModalClick}>
                                <div className="border-2 rounded-full p-1 border-var(--foreground) overflow-hidden w-[50px] h-[50px] flex items-center justify-center">
                                    {user?.image_user ? (
                                        <Image
                                            src={`http://localhost:3333/files/${user.image_user}`}
                                            alt="user"
                                            width={50}
                                            height={50}
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    ) : (
                                        <FiUser cursor="pointer" size={24} color="var(--foreground)" />
                                    )}
                                </div>
                            </button>
                        ) : (
                            <button onClick={handleLoginModalClick}>
                                <div className="border-2 rounded-full p-1 border-var(--foreground)">
                                    <FiLogIn size={22} color="var(--foreground)" />
                                </div>
                            </button>
                        )}
                    </li>
                </ul>

                {!loadingAuth && isAuthenticated ? (
                    <button onClick={handleEditUserModalClick}>
                        <div className="border-2 rounded-full p-1 border-var(--foreground) overflow-hidden w-[50px] h-[50px] flex items-center justify-center">
                            {user?.image_user ? (
                                <Image
                                    src={`${API_URL}files/${user.image_user}`}
                                    alt="user"
                                    width={50}
                                    height={50}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            ) : (
                                <FiUser cursor="pointer" size={24} color="var(--foreground)" />
                            )}
                        </div>
                    </button>
                ) : (
                    <button onClick={handleLoginModalClick}>
                        <div className="border-2 rounded-full p-1 border-var(--foreground)">
                            <FiLogIn size={22} color="var(--foreground)" />
                        </div>
                    </button>
                )}
            </nav>
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
        </header>
    )
}