"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { setupAPIClient } from '@/services/api';

interface ConfigurationMarketingConfiguration {
  id: string;
  value: string;
}

interface ConfigurationMarketingType {
  id: string;
  name: string;
  description: string;
  configurationMarketingConfiguration: ConfigurationMarketingConfiguration[];
}

interface ConfigurationMarketingOnPublication {
  id: string;
  configurationMarketingType: ConfigurationMarketingType;
}

interface PublicationProps {
  id: string;
  title: string;
  image_url: string | null;
  status: string;
  description: string;
  clicks: number;
  redirect_url: string;
  publish_at_start: string | number | Date;
  publish_at_end: string | number | Date;
  is_popup: boolean;
  created_at: string | number | Date;
  configurationMarketingOnPublication: ConfigurationMarketingOnPublication[];
}

export function SlideBanner() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [banners, setBanners] = useState<PublicationProps[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [intervalTime, setIntervalTime] = useState<number>(5000); // Valor padrão de 5 segundos.

  useEffect(() => {
    async function fetchBanners() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get(`/marketing_publication/blog_publications`);

        const filteredBanners = response.data.filter((banner: PublicationProps) =>
          banner.image_url &&
          banner.configurationMarketingOnPublication.some((config) =>
            config.configurationMarketingType.configurationMarketingConfiguration.some(
              (conf) => conf.value === "top_home"
            )
          )
        );

        setBanners(filteredBanners);

        // Obtém o tempo de intervalo de um dos banners (ajuste conforme sua estrutura de dados)
        const dynamicInterval = response.data[0]?.configurationMarketingOnPublication[0]?.configurationMarketingType.configurationMarketingConfiguration.find(
          (conf: { value: string; }) => conf.value === "banner_interval"
        )?.value;

        if (dynamicInterval) {
          setIntervalTime(Number(dynamicInterval) * 1000); // Converte para milissegundos.
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [banners, intervalTime]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <Link href={banner.redirect_url} key={banner.id} target='_blank'>
          <Image
            src={`${API_URL}files/${banner.image_url}`}
            alt={banner.title}
            width={1200}
            height={800}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ${index === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
          />
        </Link>
      ))}
      {/* Botões de navegação */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        onClick={handlePrevSlide}
      >
        <FiArrowLeft />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        onClick={handleNextSlide}
      >
        <FiArrowRight />
      </button>
    </div>
  );
}