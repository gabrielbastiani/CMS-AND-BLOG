// components/LayoutWithSidebars.tsx
import React, { ReactNode, useState } from "react";
import { Navbar } from "../navbar";
import { Footer } from "../footer";

interface LayoutWithSidebarsProps {
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
}

const LayoutWithSidebars: React.FC<LayoutWithSidebarsProps> = ({
  leftSidebar,
  rightSidebar,
  children,
}) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);

  return (
    <>
      <Navbar />
      <header className="bg-gray-800 py-12 text-white text-center">
        <h1 className="text-3xl font-bold">Todos os Artigos do Blog</h1>
        <p className="text-gray-300 mt-2">
          Explore todos os artigos e fique por dentro das novidades.
        </p>
      </header>

      {/* Top Section for Right Sidebar (Mobile) */}
      <div className="block lg:hidden bg-gray-800 text-white p-4">
        {rightSidebar}
      </div>

      {/* Layout Container */}
      <div className="relative pt-[120px] lg:pt-[150px] flex">
        {/* Left Sidebar */}
        <aside
          className={`fixed top-[120px] lg:top-[150px] left-0 h-[calc(100vh-120px)] lg:h-[calc(100vh-150px)] bg-gray-800 text-white p-4 w-64 z-20 transform transition-transform lg:translate-x-0 ${showLeftSidebar ? "translate-x-0" : "-translate-x-full"
            } lg:block`}
        >
          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setShowLeftSidebar(false)}
            className="lg:hidden text-white bg-gray-700 px-4 py-2 rounded mb-4"
          >
            Fechar
          </button>
          {leftSidebar}
        </aside>

        {/* Button to Open Left Sidebar (Mobile Only) */}
        <button
          onClick={() => setShowLeftSidebar(true)}
          className="fixed right-4 bottom-4 lg:hidden text-white bg-gray-800 px-4 py-2 rounded z-50"
        >
          Abrir Menu
        </button>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 lg:px-8 lg:ml-64 lg:mr-64">
          {children}
        </main>

        {/* Right Sidebar (Desktop) */}
        <aside className="hidden lg:block fixed top-[150px] right-0 h-[calc(100vh-150px)] bg-gray-800 text-white p-4 w-64 z-20">
          {rightSidebar}
        </aside>
      </div>
      <Footer />
    </>
  );
};

export default LayoutWithSidebars;