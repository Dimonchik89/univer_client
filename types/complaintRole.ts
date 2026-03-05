export interface ComplaintRole {
    id: string;
    name: string;
    slug: string;
    updatedAt: string;
    createdAt: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
}

export interface ComplaintRoleResponse {
    results: ComplaintRole[];
    total: number;
    limit: number;
    page: number;
}
