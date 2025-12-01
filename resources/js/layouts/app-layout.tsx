import { useAppearance } from '@/hooks/use-appearance';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import AppHeaderLayout from './app/app-header-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
    title?: string;
}

export default ({
    children,
    breadcrumbs,
    className,
    title,
    ...props
}: AppLayoutProps) => {
    const { layoutStyle } = useAppearance();

    return layoutStyle.toLowerCase() === 'sidebar' ? (
        <AppSidebarLayout
            breadcrumbs={breadcrumbs}
            className={className}
            children={children}
            title={title}
            {...props}
        />
    ) : (
        <AppHeaderLayout
            breadcrumbs={breadcrumbs}
            children={children}
            title={title}
            {...props}
        />
    );
};
