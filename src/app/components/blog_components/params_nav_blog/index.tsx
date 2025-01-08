import { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";
import SearchInput from "../../dataTable/searchInput";
import OrderSelect from "../../dataTable/orderSelect";
import PaginationControls from "../../dataTable/paginationControls";
import { AuthContext } from "@/contexts/AuthContext";
import { Container_page } from "../container_page";
import { Navbar } from "../navbar";
import { Footer } from "../footer";

interface DataProps {
    customNamesOrder: {};
    availableColumnsOrder: string[];
    columnsOrder: any;
    availableColumns: string[];
    customNames?: {};
    table_data: string;
    url_item_router?: string;
    data: any[];
    totalPages: number;
    onFetchData: (
        params: {
            page: number;
            limit: number;
            search: string;
            orderBy: string;
            orderDirection: string,
        }) => void;
}

function Params_nav_blog({
    availableColumnsOrder,
    customNamesOrder,
    columnsOrder,
    data,
    totalPages,
    onFetchData,
}: DataProps) {

    const { user } = useContext(AuthContext);

    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [orderBy, setOrderBy] = useState("created_at");
    const [orderDirection, setOrderDirection] = useState("desc");
    const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 5);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

    useEffect(() => {
        const initialSearch = searchParams.get("search") || "";
        const initialOrderBy = searchParams.get("orderBy") || "created_at";
        const initialOrderDirection = searchParams.get("orderDirection") || "desc";
        const initialLimit = Number(searchParams.get("limit")) || 5;
        const initialCurrentPage = Number(searchParams.get("page")) || 1;

        setSearch(initialSearch);
        setOrderBy(initialOrderBy);
        setOrderDirection(initialOrderDirection);
        setLimit(initialLimit);
        setCurrentPage(initialCurrentPage);

    }, [searchParams]);

    const updateUrlParams = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (orderBy) params.set("orderBy", orderBy);
        if (orderDirection) params.set("orderDirection", orderDirection);
        if (limit) params.set("limit", limit.toString());
        if (currentPage) params.set("page", currentPage.toString());

        router.replace(`?${params.toString()}`);
    };

    useEffect(() => {
        updateUrlParams();
    }, [search, orderBy, orderDirection, limit, currentPage]);

    useEffect(() => {
        onFetchData({ page: currentPage, limit, search, orderBy, orderDirection });
    }, [currentPage, limit, orderBy, orderDirection, search]);

    function handleLimitChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    }

    function handleResetFilters() {
        setSearch("");
        setOrderBy("created_at");
        setOrderDirection("desc");
        setLimit(5);
        setCurrentPage(1);
        router.replace("");
    }

    return (
        <Container_page>
            <Navbar />
            <>
                {/* Section Header */}
                <header className="bg-gray-800 py-12 text-white text-center">
                    <h1 className="text-3xl font-bold">Todos os Artigos do Blog</h1>
                    <p className="text-gray-300 mt-2">
                        Explore os últimos artigos e fique por dentro das novidades.
                    </p>
                </header>

                <OrderSelect
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    columns={columnsOrder}
                    onOrderByChange={setOrderBy}
                    onOrderDirectionChange={setOrderDirection}
                    availableColumns={availableColumnsOrder}
                    customNames={customNamesOrder}
                />

                {data.map((item) => (
                    <>

                    </>
                ))}

                {/* Paginação */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex justify-center sm:justify-between w-full sm:w-80 space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-gray-300 rounded disabled:opacity-50 text-black w-full sm:w-auto"
                        >
                            Anterior
                        </button>
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-gray-300 rounded disabled:opacity-50 text-black w-full sm:w-auto"
                        >
                            Próxima
                        </button>
                    </div>
                    <div className="flex items-center w-full sm:w-auto">
                        <label htmlFor="limit" className="mr-2">Itens por página:</label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={handleLimitChange}
                            className="border p-2 rounded text-black"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>
            </>
            <Footer />
        </Container_page>
    );
}

export default Params_nav_blog;