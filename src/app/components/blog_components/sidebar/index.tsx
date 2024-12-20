import Link from "next/link";


export function Sidebar({ categories }: { categories: string[] }) {
    return (
        <aside className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Categorias</h3>
            <ul>
                {categories.map((category, index) => (
                    <li key={index} className="mb-2">
                        <Link href={`/categories/${category.toLowerCase()}`} className="text-blue-600 hover:underline">
                            {category}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}