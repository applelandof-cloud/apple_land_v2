import CreateStaffForm from '@/components/staff/CreateStaffForm';
import StaffList from '@/components/staff/StaffList';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { FloatingDeleteButton } from '@/components/ui/floating-delete-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import Switch from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/layouts/app-layout';
import { staff } from '@/routes';
import {
    createStaff,
    deleteStaff,
    getStaff,
    searchStaff,
    updateStaff,
} from '@/services/staffService';
import { Place, Role, User, type BreadcrumbItem } from '@/types';
import { isAxiosError } from 'axios';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: staff().url,
        icon: Users,
    },
];

export default function Staff() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [isCreating, setIsCreating] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User>>({
        name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        roles: [],
        places: [],
    });
    const [creationErrors, setCreationErrors] = useState<
        Record<string, string[]>
    >({});

    const handleNewUserInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
        if (creationErrors[name]) {
            setCreationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleNewUserRoleChange = (roleId: string) => {
        const role = roles.find((r) => r.id.toString() === roleId);
        if (!role) return;

        const currentRoles = newUser.roles || [];
        const newRoles = currentRoles.some((r) => r.id === role.id)
            ? currentRoles.filter((r) => r.id !== role.id)
            : [...currentRoles, role];
        setNewUser({ ...newUser, roles: newRoles });

        if (creationErrors.roles) {
            setCreationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.roles;
                return newErrors;
            });
        }
    };

    const handleNewUserPlaceChange = (placeId: string) => {
        const place = places.find((p) => p.id.toString() === placeId);
        if (!place) return;

        const currentPlaces = newUser.places || [];
        const newPlaces = currentPlaces.some((p) => p.id === place.id)
            ? currentPlaces.filter((p) => p.id !== place.id)
            : [...currentPlaces, place];
        setNewUser({ ...newUser, places: newPlaces });

        if (creationErrors.places) {
            setCreationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.places;
                return newErrors;
            });
        }
    };

    const handleSaveNewUser = async () => {
        setCreationErrors({});

        const userData = {
            ...newUser,
            role_ids: newUser.roles?.map((r) => r.id),
            place_ids: newUser.places?.map((p) => p.id),
        };

        try {
            const newUserResponse = await createStaff(userData);
            const createdUser = newUserResponse.users;
            setUsers((prevUsers) => [createdUser, ...prevUsers]);
            setFilteredUsers((prevFiltered) => [createdUser, ...prevFiltered]);
            setIsCreating(false);
            setNewUser({
                name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                roles: [],
                places: [],
            });
            toast({
                title: 'Usuario creado',
                description: `El usuario ${createdUser.name} ${createdUser.last_name} ha sido creado exitosamente.`,
            });
        } catch (error: unknown) {
            if (
                isAxiosError(error) &&
                error.response &&
                error.response.status === 422
            ) {
                setCreationErrors(error.response.data.errors);
                toast({
                    variant: 'destructive',
                    title: 'Error de validación',
                    description: 'Por favor, revise los campos del formulario.',
                });
            } else {
                console.error('Error creating user:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error al crear el usuario',
                    description:
                        'Ocurrió un error al intentar crear el usuario.',
                });
            }
        }
    };

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingUserData, setEditingUserData] = useState<Partial<User>>({});
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [updateErrors, setUpdateErrors] = useState<Record<string, string[]>>(
        {},
    );
    const [showActive, setShowActive] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
            const status = showActive ? 'active' : 'inactive';
            getStaff(status)
                .then((data) => {
                    setUsers(data.users);
                    setFilteredUsers(data.users);
                    setRoles(data.roles);
                    setPlaces(data.places);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 0);
        return () => clearTimeout(timer);
    }, [showActive]);

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id);
        setEditingUserData(user);
    };

    const handleSaveClick = () => {
        if (!editingUserId) return;
        updateStaff(editingUserId, editingUserData)
            .then((updatedUser) => {
                const updatedUsers = users.map((user) =>
                    user.id === editingUserId ? updatedUser : user,
                );
                setUsers(updatedUsers);

                const newFilteredUsers = updatedUsers.filter(
                    (user) =>
                        user.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        user.last_name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        user.email
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                );
                setFilteredUsers(newFilteredUsers);

                setEditingUserId(null);
                setUpdateErrors({});
                toast({
                    title: 'Usuario actualizado',
                    description: `El usuario ${updatedUser.name} ${updatedUser.last_name} ha sido actualizado exitosamente.`,
                });
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    setUpdateErrors(error.response.data.errors);
                    toast({
                        variant: 'destructive',
                        title: 'Error de validación',
                        description:
                            'Por favor, revise los campos del formulario.',
                    });
                } else {
                    console.error('Error updating user:', error);
                    toast({
                        variant: 'destructive',
                        title: 'Error al actualizar el usuario',
                        description:
                            'Ocurrió un error al intentar actualizar el usuario.',
                    });
                }
            });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            const status = showActive ? 'active' : 'inactive';
            if (searchQuery) {
                searchStaff(searchQuery, status)
                    .then((data) => {
                        setFilteredUsers(data);
                    })
                    .catch((error) => {
                        console.error('Error searching users:', error);
                    })
                    .finally(() => {});
            } else {
                if (filteredUsers.length !== users.length) {
                    setFilteredUsers(users);
                }
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, showActive, users]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUserIds(filteredUsers.map((user) => user.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUserIds((prev) => [...prev, userId]);
        } else {
            setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
        }
    };

    const handleRoleChange = (roleId: string) => {
        const role = roles.find((r) => r.id.toString() === roleId);
        if (!role) return;

        const currentRoles = editingUserData.roles || [];
        const newRoles = currentRoles.some((r) => r.id === role.id)
            ? currentRoles.filter((r) => r.id !== role.id)
            : [...currentRoles, role];
        setEditingUserData({ ...editingUserData, roles: newRoles });

        if (updateErrors.roles) {
            setUpdateErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.roles;
                return newErrors;
            });
        }
    };

    const handlePlaceChange = (placeId: string) => {
        const place = places.find((p) => p.id.toString() === placeId);
        if (!place) return;

        const currentPlaces = editingUserData.places || [];
        const newPlaces = currentPlaces.some((p) => p.id === place.id)
            ? currentPlaces.filter((p) => p.id !== place.id)
            : [...currentPlaces, place];
        setEditingUserData({ ...editingUserData, places: newPlaces });

        if (updateErrors.places) {
            setUpdateErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.places;
                return newErrors;
            });
        }
    };

    const confirmDelete = () => {
        deleteStaff(selectedUserIds)
            .then(() => {
                const status = showActive ? 'active' : 'inactive';
                getStaff(status)
                    .then((data) => {
                        setUsers(data.users);
                        setFilteredUsers(data.users);
                        setRoles(data.roles);
                        setPlaces(data.places);
                    })
                    .catch((error) => {
                        console.error(
                            'Error fetching data after delete:',
                            error,
                        );
                    });
                setSelectedUserIds([]);
                setIsConfirmingDelete(false);
                toast({
                    title: 'Usuarios eliminados',
                    description: 'Los usuarios seleccionados están inactivos.',
                });
            })
            .catch((error) => {
                console.error('Error deleting users:', error);
                setIsConfirmingDelete(false);
                toast({
                    variant: 'destructive',
                    title: 'Error al eliminar usuarios',
                    description:
                        'Ocurrió un error al intentar eliminar los usuarios seleccionados.',
                });
            });
    };

    if (loading) {
        return (
            <Layout breadcrumbs={breadcrumbs} title={document.title}>
                <div className="flex h-screen items-center justify-center p-4 md:p-6">
                    <Spinner />
                </div>
            </Layout>
        );
    }

    return (
        <Layout breadcrumbs={breadcrumbs} title={document.title}>
            <div className="p-4 md:p-4">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center">
                    <div className="mt-4 flex w-full items-center space-x-2 sm:mt-0 sm:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar Usuarios..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <SlidersHorizontal className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="active-users"
                                                checked={showActive}
                                                onCheckedChange={setShowActive}
                                                className={
                                                    showActive === true
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                }
                                            />
                                            <Label htmlFor="active-users">
                                                {showActive
                                                    ? 'Mostrando activos'
                                                    : 'Mostrando inactivos'}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="border-b">
                    <div className="hidden items-center bg-gray-50 p-4 sm:flex dark:bg-neutral-800">
                        <Checkbox
                            onCheckedChange={handleSelectAll}
                            checked={
                                selectedUserIds.length ===
                                    filteredUsers.length &&
                                filteredUsers.length > 0
                            }
                        />
                        <div className="ml-4 grid flex-1 grid-cols-2 items-center gap-4 md:grid-cols-9">
                            <div className="col-span-2 font-semibold">
                                Usuario
                            </div>
                            <div className="col-span-2 font-semibold">Rol</div>
                            <div className="col-span-2 font-semibold">
                                Sucursal
                            </div>
                            <div className="col-span-1 font-semibold">
                                Estado
                            </div>
                            <div className="col-span-1 font-semibold">
                                Acciones
                            </div>
                        </div>
                    </div>
                    <StaffList
                        users={filteredUsers}
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
                        updateErrors={updateErrors}
                        setErrors={setUpdateErrors}
                    />
                </div>
                <div className="fixed right-6 bottom-6 z-50 flex space-x-4">
                    {selectedUserIds.length > 0 && (
                        <AlertDialog
                            open={isConfirmingDelete}
                            onOpenChange={setIsConfirmingDelete}
                        >
                            <AlertDialogTrigger asChild>
                                <FloatingDeleteButton
                                    onClick={() => setIsConfirmingDelete(true)}
                                    className="bg-red-600 hover:bg-red-700"
                                ></FloatingDeleteButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Está seguro?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. El
                                        usuario quedara inactivo y se eliminaran
                                        lo(s) rol(es) y la(s) sucursal(es)
                                        asignados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDelete}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <FloatingActionButton onClick={() => setIsCreating(true)} />
                </div>
            </div>
            {isCreating && (
                <CreateStaffForm
                    newUser={newUser}
                    roles={roles}
                    places={places}
                    handleInputChange={handleNewUserInputChange}
                    handleRoleChange={handleNewUserRoleChange}
                    handlePlaceChange={handleNewUserPlaceChange}
                    handleSaveNewUser={handleSaveNewUser}
                    handleCancel={() => setIsCreating(false)}
                    errors={creationErrors}
                />
            )}
        </Layout>
    );
}