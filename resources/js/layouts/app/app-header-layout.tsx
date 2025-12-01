import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { footerNavItems, mainNavItems } from '@/config/navigation';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader
                breadcrumbs={breadcrumbs}
                mainNavItems={mainNavItems}
                rightNavItems={footerNavItems}
            />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
