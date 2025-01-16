"use client"

import { Newsletter } from "../newsletter";
import Last_post from "../last_posts";
import Categories_grid from "../categories_grid";
import Most_posts_views from "../most_posts_views";

const HomePage = () => {
    return (
        <div className="w-full bg-gray-100">
            <Last_post />
            <Newsletter />
            <Categories_grid />
            <Most_posts_views />
        </div>
    );
};

export default HomePage;