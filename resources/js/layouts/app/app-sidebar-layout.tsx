import { AppContent } from '@/components/app-content';
// import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { footerNavItems, mainNavItems } from '@/config/navigation';
// import { useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    className,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; className?: string }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar
                mainNavItems={mainNavItems}
                footerNavItems={footerNavItems}
            />
            <AppContent variant="sidebar" className={className}>
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
