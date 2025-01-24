"use client"

import Image from "next/image";
import BlogLayout from "./components/blog_components/blogLayout";
import { Footer } from "./components/blog_components/footer";
import { Navbar } from "./components/blog_components/navbar";
import { SlideBanner } from "./components/blog_components/slideBanner";
import mkt from '../assets/no-image-icon-6.png'
import HomePage from "./components/blog_components/homePage";

export default function Home_page() {

  return (
    <BlogLayout
      navbar={<Navbar />}
      bannersSlide={<SlideBanner position="SLIDER" local="Pagina_inicial" />}
      footer={<Footer />}
      banners={
        [
          <Image src={mkt} alt="Banner 1" className="w-full rounded" width={80} height={80} />,
          <Image src={mkt} alt="Banner 2" className="w-full rounded" width={80} height={80} />
        ]
      }
      children={
        <HomePage />
      }
    />
  )
}