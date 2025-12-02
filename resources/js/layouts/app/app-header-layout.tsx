
import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { footerNavItems } from '@/config/navigation';
import { adminNavItems, ownerNavItems, sellerNavItems } from '@/config/roles';
import { usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import type { PropsWithChildren } from 'react';
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

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    title,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title?: string }>) {
    const {
        props: {
            auth: { user },
        },
    } = usePage<SharedData>();

    const mainNavItems = getNavItemsForRole(user.active_role ?? 'guest');
    return (
        <AppShell>
            <AppHeader
                breadcrumbs={breadcrumbs}
                mainNavItems={mainNavItems}
                rightNavItems={footerNavItems}
                title={title}
            />
            <AppContent>{children}</AppContent>
            <Toaster />
        </AppShell>
    );
}

