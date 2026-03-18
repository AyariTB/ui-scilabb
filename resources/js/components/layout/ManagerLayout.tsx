import type { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import { MENU_CONFIG } from "@/constants/menuConfig";

interface ManagerLayoutProps {
    children: ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
    return (
        <DashboardLayout
            menuSections={MENU_CONFIG.manager}
            platformTitle="Manager Kapal"
        >
            {children}
        </DashboardLayout>
    );
}
