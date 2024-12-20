import { Categories } from "./components/blog_components/categories";
import { Footer } from "./components/blog_components/footer";
import { Navbar } from "./components/blog_components/navbar";
import { Newsletter } from "./components/blog_components/newsletter";
import { PostsGrid } from "./components/blog_components/postGrid";
import { SlideBanner } from "./components/blog_components/slideBanner";


export default function Dashboard() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* <SlideBanner /> */}

      <PostsGrid title="Últimos Posts" posts={['post1', 'post2', 'post3', 'post4', 'post5', 'post6']} />

      <Newsletter />

      <Categories />

      <PostsGrid title="Posts Mais Visualizados" posts={['popular1', 'popular2', 'popular3', 'popular4']} />

      <Footer />
    </div>
  );
}