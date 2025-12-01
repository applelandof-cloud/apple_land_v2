import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { footerNavItems, mainNavItems } from '@/config/navigation';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
    title,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; title?: string }>) {
    return (
        <AppShell>
            <AppHeader
                breadcrumbs={breadcrumbs}
                mainNavItems={mainNavItems}
                rightNavItems={footerNavItems}
                title={title}
            />
            <AppContent>
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}
