"use client"

import { useContext, useState } from "react";
import DataTable from "../components/dataTable";
import { Section } from "../components/section";
import { SidebarAndHeader } from "../components/sidebarAndHeader";
import { TitlePage } from "../components/titlePage";
import { setupAPIClient } from "@/services/api";
import moment from "moment";
import { AuthContext } from "@/contexts/AuthContext";
import { FaFileExport, FaRegCommentDots, FaRegNewspaper, FaTags, FaUser } from "react-icons/fa";
import { MdCategory, MdConnectWithoutContact, MdPostAdd } from "react-icons/md";
import { toast } from "react-toastify";

interface NotificationProps {
    id: string;
    message: string;
    created_at: string | number | Date;
    read: boolean;
    type: string;
}

export default function Central_notifications() {

    const { user } = useContext(AuthContext);

    const user_id = user?.id;

    const [notification, setNotification] = useState<NotificationProps[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const apiClient = setupAPIClient();

    async function fetchNotifications({ page, limit, search, orderBy, orderDirection, startDate, endDate }: any) {
        try {
            const response = await apiClient.get(`/notifications_user/central_notifications`, {
                params: { page, limit, search, orderBy, orderDirection, startDate, endDate, user_id }
            });
            setNotification(response.data.notifications_user);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    }

    const markAsRead = async (id: string) => {
        try {
            await apiClient.put(`/notifications/mark-read?notificationUser_id=${id}`);
            setNotification((prev) =>
                prev.map((notifi) =>
                    notifi.id === id ? { ...notifi, read: true } : notifi
                )
            );
        } catch (error) {
            console.error("Erro ao marcar notificação como lida:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.put(`/notifications/mark-all-read?user_id=${user?.id}`);
            setNotification((prev) =>
                prev.map((notification) => ({ ...notification, read: true }))
            );
            toast.success("Toadas as suas notificações foram marcadas como lidas");
        } catch (error) {
            console.error("Erro ao marcar todas as notificações como lidas:", error);
            toast.error("Erro ao marcar todas as notificações como lidas");
        }
    };

    // ---- SELECT PARA ORDENAÇÂO DOS ---- //

    const columnsOrder: any = [
        { key: "message", label: "Notificação" },
        { key: "read", label: "Lida ou não" },
        { key: "created_at", label: "Data de registro" },
    ];

    const availableColumnsOrder: any = ["message", "read", "created_at"];

    const customNamesOrder: any = {
        message: "Notificação",
        read: "Lida ou não",
        created_at: "Data de Registro",
    };


    return (
        <SidebarAndHeader children={
            <Section>

                <TitlePage title="NOTIFICAÇÕES" />

                <h2 className="mb-6">Você poderá visualizar todas as Notificações realizadas para o seu blog</h2>

                <button
                    onClick={markAllAsRead}
                    className="mb-4 px-6 py-3 bg-backgroundButton text-white rounded-md hover:bg-hoverButtonBackground"
                >
                    Marcar todas como lidas
                </button>

                <DataTable
                    timeFilterButton={true}
                    data={notification}
                    columns={[
                        {
                            key: "type",
                            label: "Tipo",
                            render: (item) => (
                                <span>
                                    {item.type === "user" ? <FaUser size={30} color="white" /> :
                                        item.type === "contact_form" ? <MdConnectWithoutContact size={30} color="white" /> :
                                            item.type === "post" ? <MdPostAdd size={30} color="white" /> :
                                                item.type === "newsletter" ? <FaRegNewspaper size={30} color="white" /> :
                                                    item.type === "export_data" ? <FaFileExport size={30} color="white" /> :
                                                        item.type === "comment" ? <FaRegCommentDots size={30} color="white" /> :
                                                            item.type === "tag" ? <FaTags size={30} color="white" /> :
                                                                item.type === "category" ? <MdCategory size={30} color="white" /> : null}
                                </span>
                            ),
                        },
                        { key: "message", label: "Mensagem" },
                        {
                            key: "read",
                            label: "Marcar como lida",
                            render: (item) => (
                                <button
                                    onClick={() => markAsRead(item.id)}
                                    className={`${item.read ? "text-black bg-green-500 rounded p-2 font-bold" : "rounded p-2 font-bold text-black bg-red-400"}`}

                                >
                                    {item.read ? "Sim" : "Não"}
                                </button>
                            ),
                        },
                        {
                            key: "created_at",
                            label: "Data de Criação",
                            render: (item) => (
                                <span>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</span>
                            ),
                        },
                    ]}
                    totalPages={totalPages}
                    onFetchData={fetchNotifications}
                    url_delete_data="/notifications_user/delete_notification"
                    table_data="notificationUser"
                    customNamesOrder={customNamesOrder}
                    availableColumnsOrder={availableColumnsOrder}
                    columnsOrder={columnsOrder}
                    active_export_data={false}
                    active_buttons_searchInput_notification={true}
                    modal_delete_bulk={false}
                    availableColumns={[]}
                    generate_excel_delete=""
                    delete_bulk_data=""
                    active_buttons_searchInput_comments={false}
                    checkbox_delete={false}
                />
            </Section>
        } />
    );
}