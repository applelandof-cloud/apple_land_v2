import type { User, Role, Place } from '@/types';
import apiClient from './apiClient';

export interface StaffApiResponse {
    users: User[];
    roles: Role[];
    places: Place[];
}

/**
 * Fetch users based on their status.
 * @param status - 'active' or 'inactive'
 */
export const getStaff = (status: 'active' | 'inactive'): Promise<StaffApiResponse> => {
    return apiClient.get<StaffApiResponse>(`/staff?status=${status}`).then(res => res.data);
};

/**
 * Search for users by a query string and status.
 * @param query - The search term.
 * @param status - 'active' or 'inactive'
 */
export const searchStaff = (query: string, status: 'active' | 'inactive'): Promise<User[]> => {
    return apiClient.get<User[]>(`/staff/search?query=${query}&status=${status}`).then(res => res.data);
};

/**
 * Update a user's data.
 * @param userId - The ID of the user to update.
 * @param userData - The partial user data to update.
 */
export const updateStaff = (userId: number, userData: Partial<User>): Promise<User> => {
    return apiClient.patch<User>(`/staff/${userId}`, userData).then(res => res.data);
};

/**
 * Update a user's data.
 * @param userData - The user data to create.
 */
export const createStaff = (userData: Partial<User>): Promise<{ users: User }> => {
    return apiClient.post<{ users: User }>(`/staff`, userData).then(res => res.data);
};

/**
 * Delete one or more users by their IDs.
 * @param ids - An array of user IDs to delete.
 */
export const deleteStaff = (ids: number[]): Promise<void> => {
    return apiClient.delete('/staff', { data: { ids } });
};
