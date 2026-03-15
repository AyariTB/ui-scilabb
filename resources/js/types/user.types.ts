export type UserRole = "superadmin" | "admin" | "head_of_lab" | "manager";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    email_verified_at?: string;
}

export interface AuthProps {
    user: User;
}
