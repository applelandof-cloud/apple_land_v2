import { useAppearance } from '@/hooks/use-appearance';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import AppHeaderLayout from './app/app-header-layout';
import { initializeToast } from '@/lib/toast';
import { useCustomToast } from '@/hooks/use-custom-toast';

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
    const { showSuccessToast, showErrorToast } = useCustomToast();

    useEffect(() => {
        initializeToast({ showSuccessToast, showErrorToast });
    }, [showSuccessToast, showErrorToast]);

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
