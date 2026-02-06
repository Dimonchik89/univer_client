import axios from "axios";
import { DataProvider, UpdateParams } from "react-admin";
import axiosInstance from "../axios/axios-interceptor";
import { UserProfile, UserResponse } from "../../types/user";

interface ResourceMap {
    user: string;
    role: string;
    "academic-group": string;
    event: string;
    chat: string;
}

const resourceMap: ResourceMap = {
    user: "/api/user",
    role: "/api/role",
    "academic-group": "/api/academic-group",
    event: "/api/event",
    chat: "/api/chats/for-admin",
};

export const reactAdminProvider: DataProvider = {
    getList: async (resource, params) => {
        const searchParams = params.pagination;
        const { q, roles, academic_groups, ...restFilter } = params.filter;

        const endpoint = resourceMap[resource as keyof ResourceMap];
        if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

        if (endpoint === "/api/user") {
            const { data } = await axiosInstance<UserResponse>(`${endpoint}/findAll`, {
                params: {
                    page: searchParams?.page,
                    limit: searchParams?.perPage,
                    q,
                    roles,
                    academic_groups,
                },
            });

            return {
                data: data.results,
                total: data.total,
            };
        }
        if (endpoint === "/api/chats/for-admin") {
            const { data } = await axiosInstance(`${endpoint}`, {
                params: {
                    page: searchParams?.page,
                    limit: searchParams?.perPage,
                },
            });

            return {
                data: data.results,
                total: data.total,
            };
        }

        const { data } = await axiosInstance(`${endpoint}`, {
            params: {
                page: searchParams?.page,
                limit: searchParams?.perPage,
            },
        });

        return {
            data: data.results,
            total: data.total,
        };
    },
    getOne: async (resource, params) => {
        const endpoint = resourceMap[resource as keyof ResourceMap];
        if (!endpoint) throw new Error(`Unknown resource: ${resource}`);

        if (endpoint === "/api/user") {
            const { data } = await axiosInstance(`${endpoint}/profile-for-admin/${params.id}`);
            return { data };
        }
        if (endpoint === "/api/event") {
            const { data } = await axiosInstance(`${endpoint}/one-event-for-admin/${params.id}`);
            return { data };
        }
        console.log(endpoint);

        //
        if (endpoint === "/api/chats/for-admin/") {
            const { data } = await axiosInstance(`${endpoint}${params.id}`);
            console.log("data", data);

            return { data };
        }
        const { data } = await axiosInstance(`${endpoint}/${params.id}`);
        return { data };
    },
    getMany: async (resource, params) => {
        const { ids } = params;

        const allRecordsResult = await reactAdminProvider.getList(resource, {
            pagination: { page: 1, perPage: 999 },
            sort: { field: "id", order: "ASC" },
            filter: {},
        });

        const filteredData = allRecordsResult.data.filter((record) => ids.includes(record.id));

        return {
            data: filteredData,
        };
    },
    // ------------------ Проверить и изменить
    getManyReference: async () => {
        return { data: [] };
    },
    updateMany: async () => {
        return { data: [] };
    },
    deleteMany: async () => {
        return { data: [] };
    },
    // -----------------------------------------
    create: async (resource, params) => {
        const endpoint = resourceMap[resource as keyof ResourceMap];

        if (endpoint === "/api/user") {
            const payload = {
                ...params.data,
                roles: params.data.roles?.map((item: string) => ({ id: item })),
                academic_groups: params.data.academic_groups?.map((item: string) => ({ id: item })),
            };

            const { data } = await axiosInstance.post(`${endpoint}/create-for-admin`, payload);
            return { data };
        }
        if (endpoint === "/api/event") {
            const payload = {
                ...params.data,
                message: params.data.message || "",
                roles: params.data.roles?.map((item: string) => ({ id: item })),
                academic_groups: params.data.academic_groups?.map((item: string) => ({ id: item })),
            };

            console.log("user event", params.data);

            const { data } = await axiosInstance.post(`${endpoint}`, payload);
            return { data };
        }

        const { data } = await axiosInstance.post(`${endpoint}`, params.data);
        return { data };
    },
    update: async (resource, params) => {
        const endpoint = resourceMap[resource as keyof ResourceMap];
        if (endpoint === "/api/user") {
            const { id, createdAt, updatedAt, ...tailData } = params.data;
            const payload = {
                ...tailData,
                roles: params.data.roles?.map((item: string) => ({ id: item })),
                academic_groups: params.data.academic_groups?.map((item: string) => ({ id: item })),
            };

            const { data } = await axiosInstance.patch(
                `${endpoint}/update-for-admin/${params.id}`,
                payload
            );
            return { data };
        }

        if (endpoint === "/api/event") {
            const { id, createdAt, updatedAt, ...tailData } = params.data;
            const payload = {
                ...tailData,
                scheduledAt: new Date(params.data.scheduledAt).toISOString(),
                roles: params.data.roles?.map((item: string) => ({ id: item })),
                academic_groups: params.data.academic_groups?.map((item: string) => ({ id: item })),
            };

            const { data } = await axiosInstance.patch(`${endpoint}/${params.id}`, payload);
            return { data };
        }

        if (endpoint === "/api/chats/for-admin") {
            // console.log("chatId", params.data.id);
            // console.log("array users", params.data?.userIds);

            const { data } = await axiosInstance.patch(`${endpoint}/${params.data.id}`, {
                users: params.data?.userIds,
            });

            return { data };
        }

        const { data } = await axiosInstance.patch(`${endpoint}/${params.id}`, {
            name: params.data.name,
        });
        return { data };
    },
    delete: async (resource, params) => {
        if (resource === "role") {
            return {
                data: { id: params.id },
            };
        }
        const endpoint = resourceMap[resource as keyof ResourceMap];
        const { data } = await axiosInstance.delete(`${endpoint}/${params.id}`);
        return { data };
    },
};
