"use client"

import { Categories } from "./components/blog_components/categories";
import { Container_page } from "./components/blog_components/container_page";
import { Footer } from "./components/blog_components/footer";
import LayoutWithSidebars from "./components/blog_components/layoutWithSidebars";
import { Navbar } from "./components/blog_components/navbar";
import { Newsletter } from "./components/blog_components/newsletter";
import { PostsGrid } from "./components/blog_components/postGrid";
import { SlideBanner } from "./components/blog_components/slideBanner";


export default function Dashboard() {

  return (
    <LayoutWithSidebars
      leftSidebar={
        <div>
          <h2 className="text-lg font-bold">Menu</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="#" className="block hover:underline">Home</a></li>
            <li><a href="#" className="block hover:underline">Profile</a></li>
            <li><a href="#" className="block hover:underline">Settings</a></li>
          </ul>
        </div>
      }
      rightSidebar={
        <div>
          <h2 className="text-lg font-bold">Notifications</h2>
          <ul className="mt-4 space-y-2">
            <li><p>New message received</p></li>
            <li><p>System update available</p></li>
          </ul>
        </div>
      }
      children={
        <>
          {/* <SlideBanner /> */}

          <PostsGrid title="Últimos Artigos" posts={['post1', 'post2', 'post3', 'post4', 'post5', 'post6']} />

          <Newsletter />

          <Categories />

          <PostsGrid title="Artigos Mais Visualizados" posts={['popular1', 'popular2', 'popular3', 'popular4']} />
        </>
      }
    />
  )
}