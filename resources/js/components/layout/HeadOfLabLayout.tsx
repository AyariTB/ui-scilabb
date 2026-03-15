import type { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import { MENU_CONFIG } from "@/constants/menuConfig";

interface HeadOfLabLayoutProps {
    children: ReactNode;
}

export default function HeadOfLabLayout({ children }: HeadOfLabLayoutProps) {
    return (
        <DashboardLayout
            menuSections={MENU_CONFIG.head_of_lab}
            platformTitle="Lab Panel"
        >
            {children}
        </DashboardLayout>
    );
}
