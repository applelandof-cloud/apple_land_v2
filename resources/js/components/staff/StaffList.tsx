import { PlaceManagerModal } from '../place/PlaceManagerModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { User, Role, Place } from '@/types';
import { useState } from 'react';
import StaffListItem from './StaffListItem';

interface StaffListProps {
    users: User[];
    roles: Role[];
    places: Place[];
    selectedUserIds: number[];
    editingUserId: number | null;
    editingUserData: Partial<User>;
    handleSelectUser: (userId: number, checked: boolean) => void;
    handleEditClick: (user: User) => void;
    handleSaveClick: () => void;
    setEditingUserId: (userId: number | null) => void;
    setEditingUserData: (userData: Partial<User>) => void;
    handleRoleChange: (roleId: string) => void;
    handlePlaceChange: (placeId: string) => void;
    updateErrors: Record<string, string[]>;
}

export default function StaffList({
    users,
    roles,
    places,
    selectedUserIds,
    editingUserId,
    editingUserData,
    handleSelectUser,
    handleEditClick,
    handleSaveClick,
    setEditingUserId,
    setEditingUserData,
    handleRoleChange,
    handlePlaceChange,
    updateErrors,
}: StaffListProps) {
    const [isPlaceManagerModalOpen, setIsPlaceManagerModalOpen] =
        useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [userToChangePassword, setUserToChangePassword] = useState<
        number | null
    >(null);

    const handleChangePasswordClick = (userId: number) => {
        setUserToChangePassword(userId);
        setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setUserToChangePassword(null);
    };

    return (
        <>
            <PlaceManagerModal
                open={isPlaceManagerModalOpen}
                onClose={(needsUpdate: boolean) => {
                    setIsPlaceManagerModalOpen(false);
                    if (needsUpdate) {
                        console.log('Places updated, refetching...');
                    }
                }}
            />
            {userToChangePassword !== null && (
                <ChangePasswordModal
                    open={isChangePasswordModalOpen}
                    onClose={handleCloseChangePasswordModal}
                    userId={userToChangePassword}
                />
            )}
            {users.map((user) => (
                <StaffListItem
                    key={user.id}
                    user={user}
                    roles={roles}
                    places={places}
                    selectedUserIds={selectedUserIds}
                    editingUserId={editingUserId}
                    editingUserData={editingUserData}
                    handleSelectUser={handleSelectUser}
                    handleEditClick={handleEditClick}
                    handleSaveClick={handleSaveClick}
                    setEditingUserId={setEditingUserId}
                    setEditingUserData={setEditingUserData}
                    handleRoleChange={handleRoleChange}
                    handlePlaceChange={handlePlaceChange}
                    setIsPlaceManagerModalOpen={setIsPlaceManagerModalOpen}
                    handleChangePasswordClick={handleChangePasswordClick}
                    errors={updateErrors}
                />
            ))}
        </>
    );
}
