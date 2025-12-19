import { AcademicGroup } from "./academicGroup";
import { Role } from "./role";
import { UserProfile } from "./user";

export interface UniversityEvent {
    id: string;
    sender: Pick<UserProfile, "email" | "firstName" | "lastName">;
    title: string;
    message: string;
    scheduledAt: string;
    location: string;
    registrationLink: string;
    updatedAt: Date;
    createdAt: Date;
    roles: Role[];
    academic_groups: AcademicGroup[];
}
