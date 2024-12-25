import { setupAPIClient } from '@/services/api';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
/* import { Navigation } from 'swiper'; */

export function SlideBanner() {

  useEffect(() => {
    async function fetchData() {
      try {
        const apiClient = setupAPIClient();
        const { data } = await apiClient.get("/configuration_blog/get_configs");

      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <section className="container mx-auto mt-6">
      <Swiper navigation={true} /* modules={[Navigation]} */ className="rounded-lg overflow-hidden shadow-lg">
        <SwiperSlide><img src="/images/banner1.jpg" alt="Notícia 1" className="w-full" /></SwiperSlide>
        <SwiperSlide><img src="/images/banner2.jpg" alt="Notícia 2" className="w-full" /></SwiperSlide>
        <SwiperSlide><img src="/images/banner3.jpg" alt="Notícia 3" className="w-full" /></SwiperSlide>
      </Swiper>
    </section>
  )
}