
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { footerNavItems } from '@/config/navigation';
import { adminNavItems, ownerNavItems, sellerNavItems } from '@/config/roles';
import { usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { type PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';

const getNavItemsForRole = (role: string): NavItem[] => {
    switch (role) {
        case 'owner':
            return ownerNavItems;
        case 'admin':
            return adminNavItems;
        case 'seller':
            return sellerNavItems;
        default:
            return [];
    }
};

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    className,
    title,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; className?: string; title?: string }>) {
    const {
        props: {
            auth: { user },
        },
    } = usePage<SharedData>();

    const mainNavItems = getNavItemsForRole(user.active_role ?? 'guest');
    return (
        <AppShell variant="sidebar">
            <AppSidebar mainNavItems={mainNavItems} footerNavItems={footerNavItems} />
            <AppContent variant="sidebar" className={className}>
                <AppSidebarHeader breadcrumbs={breadcrumbs} title={title} />
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}

