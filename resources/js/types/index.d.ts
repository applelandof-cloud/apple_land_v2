import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
    icon?: LucideIcon;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
}

export interface Maker {
    id: number;
    name: string;
    origin: string;
}

export interface Type {
    id: number;
    name: string;
}

export interface Color {
    id: number;
    name: string;
    hex_code: string;
}

export interface Currency {
    id: number;
    name: string;
    symbol: string;
}

export interface PriceType {
    id: number;
    name: string;
}

export interface PriceProduct {
    product_id?: number;
    price_type_id: number;
    value: number;
    currency_id: number;
    created_at?: string;
    updated_at?: string;
    price_type: PriceType; // Eager loaded
    currency: Currency;     // Eager loaded
}

export interface DeviceModel {
    product_id?: number;
    model_number: string;
    sku: string;
    sim: string;
    storage: string;
    ram: string;
}

export interface Image {
    id: number;
    name: string;
    url: string;
}

export interface ProductType {
    id: number;
    name: string;
}

export interface TechAccessory {
    product_id?: number;
    model_number: string;
    size: string;
    description: string;
}

export interface Product {
    id: number;
    name: string;
    status: string; // This is still a placeholder
    product_type_id: number;
    device_model: DeviceModel;
    tech_accessory: TechAccessory;
    prices: PriceProduct[]; // Change from Price[] to PriceProduct[]
    colors: Color[];
    makers: Maker[];
    images: Image[];
    type: Type;
    product_type: ProductType;
    categories: Category[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Place {
    id: number;
    name: string;
    address: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    last_name: string;
    username: string;
    email: string;
    identification: string;
    phone_number: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at?: string;
    updated_at?: string;
    places: Place[];
    roles: Role[];
    is_active: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
}