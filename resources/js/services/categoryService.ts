import type { Category } from '@/types';
import { isAxiosError } from 'axios';
import apiClient from './apiClient';

interface ValidationErrors {
    [key: string]: string[];
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<{ categories: Category[] }>('/categories');
    return response.data.categories;
};

export const saveCategory = async (
    category: Partial<Category>,
): Promise<
    Category | { errors?: ValidationErrors; message?: string; error?: string }
> => {
    const url = category.id ? `/categories/${category.id}` : '/categories';
    const method = category.id ? 'put' : 'post';
    try {
        const response = await apiClient[method]<Category>(url, category);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 422) {
                return { errors: error.response.data.errors };
            }
            return {
                message: error.response.data.message,
                error: error.response.data.error,
            };
        }
        throw error;
    }
};

export const deleteCategory = async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
};
