import type { Place } from '@/types';
import { isAxiosError } from 'axios';
import apiClient from './apiClient';

interface ValidationErrors {
    [key: string]: string[];
}

export const getPlaces = async (): Promise<Place[]> => {
    const response = await apiClient.get<Place[]>('/places');
    return response.data;
};

export const savePlace = async (
    place: Partial<Place>,
): Promise<
    Place | { errors?: ValidationErrors; message?: string; error?: string }
> => {
    const url = place.id ? `/places/${place.id}` : '/places';
    const method = place.id ? 'patch' : 'post';
    try {
        const response = await apiClient[method]<Place>(url, place);
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

export const deletePlace = async (id: number): Promise<void> => {
    await apiClient.delete(`/places/${id}`);
};
