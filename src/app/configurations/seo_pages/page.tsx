"use client"

import { Section } from "@/app/components/section";
import { SidebarAndHeader } from "@/app/components/sidebarAndHeader";
import { TitlePage } from "@/app/components/titlePage";
import { setupAPIClient } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  page: z.string().nonempty("O campo página é obrigatório"),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageWidth: z.string().optional(),
  ogImageHeight: z.string().optional(),
  ogImageAlt: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterCreator: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SeoPages() {
  const [ogImages, setOgImages] = useState<File[]>([]);
  const [ogPreviews, setOgPreviews] = useState<string[]>([]);
  const [twitterImages, setTwitterImages] = useState<File[]>([]);
  const [twitterPreviews, setTwitterPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleOgImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validFiles.length !== files.length) {
      toast.error("Alguns arquivos não são JPEG/PNG e foram ignorados");
    }

    setOgImages(validFiles);
    setOgPreviews(validFiles.map(file => URL.createObjectURL(file)));
  };

  const handleTwitterImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validFiles.length !== files.length) {
      toast.error("Alguns arquivos não são JPEG/PNG e foram ignorados");
    }

    setTwitterImages(validFiles);
    setTwitterPreviews(validFiles.map(file => URL.createObjectURL(file)));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Campos textuais
      formData.append("page", data.page);
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("keywords", JSON.stringify(
        data.keywords?.split(",").map(k => k.trim()) || []
      ));
      formData.append("ogTitle", data.ogTitle || "");
      formData.append("ogDescription", data.ogDescription || "");
      formData.append("ogImageWidth", data.ogImageWidth || "");
      formData.append("ogImageHeight", data.ogImageHeight || "");
      formData.append("ogImageAlt", data.ogImageAlt || "");
      formData.append("twitterTitle", data.twitterTitle || "");
      formData.append("twitterDescription", data.twitterDescription || "");
      formData.append("twitterCreator", data.twitterCreator || "");

      // Imagens
      ogImages.forEach(file => formData.append("ogImages", file));
      twitterImages.forEach(file => formData.append("twitterImages", file));

      const apiClient = setupAPIClient();
      await apiClient.post("/configuration_blog/seo/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Configurações SEO salvas com sucesso!");
      reset();
      setOgImages([]);
      setOgPreviews([]);
      setTwitterImages([]);
      setTwitterPreviews([]);

    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarAndHeader>
      <Section>
        <TitlePage title="CONFIGURAÇÕES SEO" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          <div className="grid gap-4">
            <label className="block">
              Página:
              <input
                type="text"
                {...register("page")}
                className="w-full p-2 border rounded-md"
                placeholder="Ex: /blog, /contato"
              />
              {errors.page && <span className="text-red-500 text-sm">{errors.page.message}</span>}
            </label>

            <label className="block">
              Título:
              <input
                type="text"
                {...register("title")}
                className="w-full p-2 border rounded-md"
              />
            </label>

            <label className="block">
              Descrição:
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded-md h-24"
              />
            </label>

            <label className="block">
              Palavras-chave (separadas por vírgula):
              <input
                type="text"
                {...register("keywords")}
                className="w-full p-2 border rounded-md"
                placeholder="Ex: SEO, Marketing, Tecnologia"
              />
            </label>
          </div>

          {/* Seção Open Graph */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Open Graph</h3>
            
            <div className="grid gap-4">
              <label className="block">
                Título OG:
                <input
                  type="text"
                  {...register("ogTitle")}
                  className="w-full p-2 border rounded-md"
                />
              </label>

              <label className="block">
                Descrição OG:
                <textarea
                  {...register("ogDescription")}
                  className="w-full p-2 border rounded-md h-24"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  Largura da Imagem OG:
                  <input
                    type="number"
                    {...register("ogImageWidth")}
                    className="w-full p-2 border rounded-md"
                  />
                </label>

                <label className="block">
                  Altura da Imagem OG:
                  <input
                    type="number"
                    {...register("ogImageHeight")}
                    className="w-full p-2 border rounded-md"
                  />
                </label>
              </div>

              <label className="block">
                Texto Alternativo OG:
                <input
                  type="text"
                  {...register("ogImageAlt")}
                  className="w-full p-2 border rounded-md"
                />
              </label>

              <div className="block">
                <label className="mb-2 block">Imagens OG (Máx. 5):</label>
                <div className="flex flex-wrap gap-4">
                  <label className="relative w-32 h-32 rounded-lg cursor-pointer flex justify-center items-center bg-gray-100 border-2 border-dashed">
                    <FiUpload className="text-gray-500 text-2xl" />
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png"
                      onChange={handleOgImages}
                      className="hidden"
                      max={5}
                    />
                  </label>
                  {ogPreviews.map((preview, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <Image
                        src={preview}
                        alt={`Preview OG ${index}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção Twitter */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Twitter</h3>
            
            <div className="grid gap-4">
              <label className="block">
                Título Twitter:
                <input
                  type="text"
                  {...register("twitterTitle")}
                  className="w-full p-2 border rounded-md"
                />
              </label>

              <label className="block">
                Descrição Twitter:
                <textarea
                  {...register("twitterDescription")}
                  className="w-full p-2 border rounded-md h-24"
                />
              </label>

              <label className="block">
                Criador Twitter:
                <input
                  type="text"
                  {...register("twitterCreator")}
                  className="w-full p-2 border rounded-md"
                  placeholder="@usuário"
                />
              </label>

              <div className="block">
                <label className="mb-2 block">Imagens Twitter (Máx. 5):</label>
                <div className="flex flex-wrap gap-4">
                  <label className="relative w-32 h-32 rounded-lg cursor-pointer flex justify-center items-center bg-gray-100 border-2 border-dashed">
                    <FiUpload className="text-gray-500 text-2xl" />
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png"
                      onChange={handleTwitterImages}
                      className="hidden"
                      max={5}
                    />
                  </label>
                  {twitterPreviews.map((preview, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <Image
                        src={preview}
                        alt={`Preview Twitter ${index}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Salvando..." : "Salvar Configurações"}
          </button>
        </form>
      </Section>
    </SidebarAndHeader>
  );
}