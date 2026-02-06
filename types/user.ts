import { AcademicGroup } from "./academicGroup";
import { Role } from "./role";

export interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    roles: Role[];
    academic_groups: AcademicGroup[];
}

export interface UpdateUser {
    firstName: string;
    lastName: string;
    email?: string;
}

export type DecodeToken = { id: string } | null;

export interface UserResponse {
    results: UserProfile[];
    total: number;
    page: number;
    limit: number;
}
