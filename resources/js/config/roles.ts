import { NavItem } from '@/types';
import {
    LayoutGrid,
    Boxes,
    ShoppingCart,
    Smartphone,
    Users,
    BarChart,
} from 'lucide-react';
import {
    dashboard,
    inventory,
    products,
    reports,
    sales,
    seller,
    staff,
} from '@/routes';

export const ownerNavItems: NavItem[] = [
    {
        title: 'Tablero',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Productos',
        href: products(),
        icon: Smartphone,
    },
    {
        title: 'Inventario',
        href: inventory(),
        icon: Boxes,
    },
    {
        title: 'Ventas',
        href: sales(),
        icon: ShoppingCart,
    },
    {
        title: 'Reportes',
        href: reports(),
        icon: BarChart,
    },
    {
        title: 'Usuarios',
        href: staff(),
        icon: Users,
    },
];

export const adminNavItems: NavItem[] = [
    {
        title: 'Productos',
        href: products(),
        icon: Smartphone,
    },
    {
        title: 'Ventas',
        href: sales(),
        icon: ShoppingCart,
    },
];

export const sellerNavItems: NavItem[] = [
    {
        title: 'Inventario',
        href: inventory(),
        icon: Boxes,
    },
    {
        title: 'Seller',
        href: seller(),
        icon: LayoutGrid,
    },
];