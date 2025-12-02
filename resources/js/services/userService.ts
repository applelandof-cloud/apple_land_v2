import apiClient from './apiClient';

export const switchRole = (userId: number, roleId: number) => {
    return apiClient.put(`/users/${userId}/roles/${roleId}/switch`);
};
