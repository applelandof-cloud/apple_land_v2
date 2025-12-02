
import { usePage } from '@inertiajs/react';
import { mainNavItems } from '@/config/navigation';
import { adminNavItems, sellerNavItems } from '@/config/roles';
import { type NavItem, type SharedData } from '@/types';

export function useRole() {
    const { props } = usePage<SharedData>();
    const { auth } = props;
    const { user } = auth;
    const { active_role } = user;


    const getNavItems = (): NavItem[] => {
        if (active_role === 'admin') {
            return adminNavItems;
        }
        if (active_role === 'seller') {
            return sellerNavItems;
        }
        return mainNavItems;
    };

    return {
        navItems: getNavItems(),
    };
}
