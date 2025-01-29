"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { setupAPIClient } from '@/services/api';

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
}

interface SliderProps {
  position: string;
  local: string;
}

export function SlideBanner({ position, local }: SliderProps) {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [banners, setBanners] = useState<PublicationProps[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [intervalTime, setIntervalTime] = useState<number>(3000);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get(`/marketing_publication/blog_publications/slides?position=${position}&local=${local}`);
        const { data } = await apiClient.get(`/marketing_publication/interval_banner/page_banner?local_site=${local}`);

        setBanners(response.data);

        setIntervalTime(data?.interval_banner || 5000);

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

  const click_publication = async (id: string) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.patch(`/marketing_publication/${id}/clicks`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <Link
          key={banner.id}
          href={banner.redirect_url}
          target='_blank'
          onClick={() => click_publication(banner.id)}
        >
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