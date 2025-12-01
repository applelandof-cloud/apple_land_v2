import { useState } from 'react';
import { User, Role, Place } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import Switch from '@/components/ui/switch';
import { Check, Pencil, X } from 'lucide-react';
import AlertError from '@/components/alert-error';
import { PlaceManagerModal } from '../PlaceManagerModal';
import { ChangePasswordModal } from './ChangePasswordModal';

interface StaffListItemProps {
    users: User[];
    roles: Role[];
    places: Place[];
    selectedUserIds: number[];
    editingUserId: number | null;
    editingUserData: Partial<User>;
    updateErrors: Record<string, string[]>;
    handleSelectUser: (userId: number, checked: boolean) => void;
    handleEditClick: (user: User) => void;
    handleSaveClick: () => void;
    setEditingUserId: (userId: number | null) => void;
    setEditingUserData: (userData: Partial<User>) => void;
    handleRoleChange: (role: Role) => void;
    handlePlaceChange: (place: Place) => void;
}

export default function StaffListItem({
    users,
    roles,
    places,
    selectedUserIds,
    editingUserId,
    editingUserData,
    updateErrors,
    handleSelectUser,
    handleEditClick,
    handleSaveClick,
    setEditingUserId,
    setEditingUserData,
    handleRoleChange,
    handlePlaceChange,
}: StaffListItemProps) {
    const [isPlaceManagerModalOpen, setIsPlaceManagerModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [userToChangePassword, setUserToChangePassword] = useState<number | null>(null);

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
                onClose={(needsUpdate) => {
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
                <div
                    key={user.id}
                    className={`flex items-center border-b p-4 ${selectedUserIds.includes(user.id)
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
                    <div className="ml-4 grid flex-1 grid-cols-2 items-center gap-4 md:grid-cols-9">
                        <div className="col-span-2">
                            {editingUserId === user.id ? (
                                <>
                                    <Input
                                        type="text"
                                        value={editingUserData.name}
                                        onChange={(e) =>
                                            setEditingUserData({
                                                ...editingUserData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <Input
                                        type="text"
                                        value={
                                            editingUserData.last_name
                                        }
                                        onChange={(e) =>
                                            setEditingUserData({
                                                ...editingUserData,
                                                last_name:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        username: {user.username}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        email: {user.email}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-semibold">
                                        {user.name +
                                            ' ' +
                                            user.last_name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {user.username}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="col-span-2">
                            {editingUserId === user.id ? (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start font-normal">Seleccionar Roles</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {roles.map(role => (
                                                <DropdownMenuCheckboxItem
                                                    key={role.id}
                                                    checked={(editingUserData.roles || []).some(r => r.id === role.id)}
                                                    onCheckedChange={() => handleRoleChange(role)}
                                                >
                                                    {role.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {(editingUserData.roles || []).map(role => (
                                            <span
                                                key={role.id}
                                                className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm bg-gray-200"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {user.roles.map((role) => (
                                        <span
                                            key={role.id}
                                            className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm bg-gray-200"
                                        >
                                            {role.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-span-2">
                            {editingUserId === user.id ? (
                                <>
                                    <div className="flex items-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start font-normal">Seleccionar Sucursales</Button>
                                        </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {places.map(place => (
                                                    <DropdownMenuCheckboxItem
                                                        key={place.id}
                                                        checked={(editingUserData.places || []).some(p => p.id === place.id)}
                                                        onCheckedChange={() => handlePlaceChange(place)}
                                                    >
                                                        {place.name}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button variant="ghost" size="icon" className="ml-2" onClick={() => setIsPlaceManagerModalOpen(true)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {(editingUserData.places || []).map(place => (
                                            <span
                                                key={place.id}
                                                className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm"
                                            >
                                                {place.name}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {user.places.map((place) => (
                                        <span
                                            key={place.id}
                                            className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm"
                                        >
                                            {place.name}

                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                            {editingUserId === user.id ? (
                                <>
                                    <Switch
                                        checked={
                                            editingUserData.is_active
                                        }
                                        onCheckedChange={(checked) =>
                                            setEditingUserData({
                                                ...editingUserData,
                                                is_active: checked,
                                            })
                                        }
                                        className={
                                            editingUserData.is_active ==
                                                1
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }
                                    />{' '}
                                    <span className="text-xs">
                                        {editingUserData.is_active
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </span>
                                </>
                            ) : (
                                <span
                                    className={`rounded-full px-2 py-1 text-xs ${user.is_active == 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                >
                                    {user.is_active == 1
                                        ? 'Activo'
                                        : 'Inactivo'}
                                </span>
                            )}
                        </div>
                        <div className="col-span-1">
                            {editingUserId === user.id ? (
                                <>
                                    {Object.keys(updateErrors).length > 0 && (
                                        <AlertError errors={Object.values(updateErrors)} />
                                    )}
                                    <div className="flex justify-between items-center w-full mb-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleSaveClick}
                                            className="w-full"
                                        >
                                            <Check className="h-4 w-4 lg:h-5 lg:w-5" />
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => setEditingUserId(null)}
                                            className="w-full"
                                        >
                                            <X className="h-4 w-4 lg:h-5 lg:w-5" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="default"
                                        onClick={() => handleChangePasswordClick(user.id)}
                                        className="w-full"
                                    >
                                        Cambiar Password
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="border bg-white text-black dark:bg-neutral-800 dark:text-white"
                                    variant="outline"
                                    onClick={() => handleEditClick(user)}
                                >
                                    Editar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
