import type { Color } from '@/types';
import { isAxiosError } from 'axios';
import apiClient from './apiClient';

interface ValidationErrors {
    [key: string]: string[];
}

export const getColors = async (): Promise<Color[]> => {
    const response = await apiClient.get<Color[]>('/colors');
    return response.data;
};

export const saveColor = async (
    color: Partial<Color>,
): Promise<
    Color | { errors?: ValidationErrors; message?: string; error?: string }
> => {
    const url = color.id ? `/colors/${color.id}` : '/colors';
    const method = color.id ? 'put' : 'post';
    try {
        const response = await apiClient[method]<Color>(url, color);
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

export const deleteColor = async (id: number): Promise<void> => {
    await apiClient.delete(`/colors/${id}`);
};
