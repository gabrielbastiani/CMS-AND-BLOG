"use client"

import { useState } from "react";
import DataTable from "../components/dataTable";
import { Section } from "../components/section";
import { SidebarAndHeader } from "../components/sidebarAndHeader";
import { TitlePage } from "../components/titlePage";
import { setupAPIClient } from "@/services/api";
import moment from "moment";

interface NewslattersProps {
    id: string;
    name_user: string;
    email_user: string;
    created_at: string | number | Date;
}

export default function Newsletter() {

    const [newslatters, setNewslatters] = useState<NewslattersProps[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const apiClient = setupAPIClient();

    async function fetchNewslatters({ page, limit, search, orderBy, orderDirection, startDate, endDate }: any) {
        try {
            const response = await apiClient.get(`/newsletter/get_newsletters`, {
                params: { page, limit, search, orderBy, orderDirection, startDate, endDate }
            });
            setNewslatters(response.data.newslatters);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    }

    // ---- COLUNAS PARA EXPORTAÇÂO DE DADOS ---- //

    const availableColumns = ["name_user", "email_user", "created_at"];

    const customNames: any = {
        name_user: "Nome do contato",
        email_user: "Email do contato",
        created_at: "Data de envio"
    };

    // ---- SELECT PARA ORDENAÇÂO DOS ---- //

    const columnsOrder: any = [
        { key: "name_user", label: "Nome" },
        { key: "email_user", label: "Email" },
        { key: "created_at", label: "Data de Criação" },
    ];

    const availableColumnsOrder: any = ["name_user", "created_at", "email_user"];

    const customNamesOrder: any = {
        name_user: "Nome",
        created_at: "Data de Registro",
        email_user: "Email"
    };


    return (
        <SidebarAndHeader children={
            <Section>

                <TitlePage title="NEWSLETTER" />

                <DataTable
                    timeFilterButton={true}
                    checkbox_delete={true}
                    active_buttons_searchInput_comments={false}
                    name_file_export="newslatter"
                    modal_delete_bulk={false}
                    active_buttons_searchInput_notification={false}
                    active_export_data={true}
                    customNamesOrder={customNamesOrder}
                    availableColumnsOrder={availableColumnsOrder}
                    columnsOrder={columnsOrder}
                    table_data="newsletter"
                    url_delete_data="/newsletter/delete_newsletter"
                    data={newslatters}
                    columns={[
                        { key: "name_user", label: "Nome" },
                        { key: "email_user", label: "Email" },
                        {
                            key: "created_at",
                            label: "Data de Criação",
                            render: (item) => (
                                <span>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</span>
                            ),
                        },
                    ]}
                    totalPages={totalPages}
                    onFetchData={fetchNewslatters}
                    availableColumns={availableColumns}
                    customNames={customNames}
                    generate_excel_delete={""}
                    delete_bulk_data={""}
                />
            </Section>
        } />
    );
}