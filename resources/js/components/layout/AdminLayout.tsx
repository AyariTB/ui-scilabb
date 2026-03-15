import type { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import { MENU_CONFIG } from "@/constants/menuConfig";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <DashboardLayout
            menuSections={MENU_CONFIG.admin}
            platformTitle="Platform Riset"
        >
            {children}
        </DashboardLayout>
    );
}
