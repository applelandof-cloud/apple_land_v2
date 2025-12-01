import AppLayout from '@/layouts/app-layout';
import AlertError from '@/components/alert-error';
import Button from '@/components/Button';
import StaffForm from '@/components/staff-form';
import Switch from '@/components/Switch';
import { router } from '@inertiajs/core';
import { useState, useEffect } from 'react';
import { staff } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Users, Search, Plus } from 'lucide-react';
import { Place, Role, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Personal',
        href: staff().url,
        icon: Users,
    },
];

export default function Staff({ users, roles, places, errors }: { users: User[], roles: Role[], places: Place[], errors: any }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingUserData, setEditingUserData] = useState<Partial<User>>({});

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id);
        setEditingUserData(user);
    };

    const handleSaveClick = () => {
        if (!editingUserId) return;
        router.patch(`/staff/${editingUserId}`, editingUserData, {
            onSuccess: () => setEditingUserId(null),
        });
    };

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    return (
        <AppLayout breadcrumbs={breadcrumbs} className="bg-[--pastel-orange]">
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-bold">Personal</h1>
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex items-center justify-center gap-4 mb-4">
                        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar personal..."
                            className="pl-8 p-2 border border-gray-300 rounded-md w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Switch
                        checked={editingUserData.is_active}
                        onCheckedChange={(checked) => setEditingUserData({ ...editingUserData, is_active: checked })}
                        className={editingUserData.is_active == 1 ? 'bg-green-500' : 'bg-red-500'}
                    />
                </div>
                {Object.keys(errors).length > 0 && (
                    <AlertError errors={Object.values(errors)} />
                )}
                {filteredUsers.map((user) => (
                    <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center p-4 border-b bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-9 gap-4 items-center">
                            <div className="col-span-2">
                                {editingUserId === user.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editingUserData.name}
                                            onChange={(e) => setEditingUserData({ ...editingUserData, name: e.target.value })}
                                            className="mt-1 block w-auto p-1 text-s border border-gray-300 rounded-md"
                                        />
                                        <input
                                            type="text"
                                            value={editingUserData.last_name}
                                            onChange={(e) => setEditingUserData({ ...editingUserData, last_name: e.target.value })}
                                            className="mt-1 block w-auto p-1 text-s border border-gray-300 rounded-md"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold">{user.name + " " + user.last_name}</h3>
                                        <p className="text-sm text-muted-foreground">{user.username}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </>
                                )}
                            </div>
                            <div className="col-span-2">
                                {editingUserId === user.id ? (
                                    <select
                                        value={editingUserData.roles?.[0]?.id || ''}
                                        onChange={(e) => {
                                            const newRoleId = parseInt(e.target.value);
                                            const newRole = roles.find(role => role.id === newRoleId);
                                            if (newRole) {
                                                setEditingUserData({ ...editingUserData, roles: [newRole] });
                                            }
                                        }}
                                        className="mt-1 block w-auto p-1 text-s border border-gray-300 rounded-md"
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {user.roles.map((role, index) => (
                                            <span key={index}>{role.name}<br /></span>
                                        ))}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2">
                                {editingUserId === user.id ? (
                                    <select
                                        value={editingUserData.places?.[0]?.id || ''}
                                        onChange={(e) => {
                                            const newPlaceId = parseInt(e.target.value);
                                            const newPlace = places.find(place => place.id === newPlaceId);
                                            if (newPlace) {
                                                setEditingUserData({ ...editingUserData, places: [newPlace] });
                                            }
                                        }}
                                        className="mt-1 block w-auto p-1 text-s border border-gray-300 rounded-md"
                                    >
                                        {places.map(place => (
                                            <option key={place.id} value={place.id}>{place.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {user.places.map((place, index) => (
                                            <span key={index}>{place.name}<br /></span>
                                        ))}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-1 flex items-center gap-2">
                                {editingUserId === user.id ? (
                                    <>
                                        <Switch
                                            checked={editingUserData.is_active}
                                            onCheckedChange={(checked) => setEditingUserData({ ...editingUserData, is_active: checked })}
                                            className={editingUserData.is_active == 1 ? 'bg-green-500' : 'bg-red-500'}
                                        />                                        <span className="text-xs">
                                            {editingUserData.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </>
                                ) : (
                                    <span className={`rounded-full px-2 py-1 text-xs ${user.is_active == 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {user.is_active == 1 ? 'Activo' : 'Inactivo'}
                                    </span>
                                )}
                            </div>
                            <div className="col-span-1">
                                <Button className="bg-white border" onClick={() => editingUserId === user.id ? handleSaveClick() : handleEditClick(user)}>
                                    {editingUserId === user.id ? 'Guardar' : 'Editar'}
                                </Button>
                                {editingUserId === user.id && (
                                    <Button className="ml-2 bg-gray-500 text-white" onClick={() => setEditingUserId(null)}>
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="fixed bottom-12 right-12 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                onClick={openForm}
            >
                <Plus className="h-6 w-6" />
            </button>
            {
                isFormOpen && (
                    <div
                        className="fixed inset-0 bg-opacity-30 z-40"
                        onClick={closeForm}
                    ></div>
                )
            }
            {isFormOpen && <StaffForm onClose={closeForm} roles={roles} places={places} />}
        </AppLayout >
    );
}
