import { dashboard, inventory, products, places, sales, reports, staff } from '@/routes';
import { type NavItem } from '@/types';
import { Smartphone, LayoutGrid, Map, ShoppingCart, BarChart, Users, Boxes,
    //  Folder, BookOpen 
} from 'lucide-react';

export const mainNavItems: NavItem[] = [
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
        title: 'Lugares',
        href: places(),
        icon: Map,
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
        title: 'Personal',
        href: staff(),
        icon: Users,
    },
];

export const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];