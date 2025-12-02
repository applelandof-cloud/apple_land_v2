import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Place, Role, User } from '@/types';
import EditStaffForm from './EditStaffForm';

interface StaffListItemProps {
    user: User;
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
    setIsPlaceManagerModalOpen: (isOpen: boolean) => void;
    handleChangePasswordClick: (userId: number) => void;
    errors: Record<string, string[]>;
}

export default function StaffListItem({
    user,
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
    setIsPlaceManagerModalOpen,
    handleChangePasswordClick,
    errors,
}: StaffListItemProps) {
    const isEditing = editingUserId === user.id;
    return (
        <div
            className={`flex items-center border-b p-4 ${
                selectedUserIds.includes(user.id)
                    ? 'bg-gray-200 dark:bg-gray-800'
                    : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
        >
            <Checkbox
                checked={selectedUserIds.includes(user.id)}
                onCheckedChange={(checked) =>
                    handleSelectUser(user.id, Boolean(checked))
                }
            />
            {isEditing ? (
                <EditStaffForm
                    editingUserData={editingUserData}
                    roles={roles}
                    places={places}
                    handleSaveClick={handleSaveClick}
                    setEditingUserId={setEditingUserId}
                    setEditingUserData={setEditingUserData}
                    handleRoleChange={handleRoleChange}
                    handlePlaceChange={handlePlaceChange}
                    setIsPlaceManagerModalOpen={setIsPlaceManagerModalOpen}
                    handleChangePasswordClick={handleChangePasswordClick}
                    errors={errors}
                />
            ) : (
                <div className="ml-4 grid flex-1 grid-cols-2 items-center gap-4 md:grid-cols-9">
                    <div className="col-span-2">
                        <h3 className="font-semibold">
                            {user.name} {user.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {user.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            celular: {user.phone_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            C.I.: {user.identification}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {user.roles.map((role) => (
                                <Badge key={role.id} variant="secondary">
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {user.places.map((place) => (
                                <Badge key={place.id} variant="outline">
                                    {place.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                        <span
                            className={`rounded-full px-2 py-1 text-xs ${
                                user.is_active
                                    ? 'bg-green-200 text-green-800'
                                    : 'bg-red-200 text-red-800'
                            }`}
                        >
                            {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div className="col-span-1">
                        <Button
                            className="border bg-white text-black dark:bg-neutral-800 dark:text-white"
                            variant="outline"
                            onClick={() => handleEditClick(user)}
                        >
                            Editar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
