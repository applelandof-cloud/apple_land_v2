import { Spinner } from '@/components/ui/spinner';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { FloatingDeleteButton } from '@/components/ui/floating-delete-button';
import StaffForm from '@/components/staff/StaffForm';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import Layout from '@/layouts/app-layout';
import { staff } from '@/routes';
import { Place, Role, User, type BreadcrumbItem } from '@/types';
import StaffListItem from '@/components/staff/StaffList';
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
import { Label } from '@/components/ui/label';
import Switch from '@/components/ui/switch';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Personal',
        href: staff().url,
        icon: Users,
    },
];

// Function to get CSRF token from meta tag
const getCsrfToken = () => {
    const tokenElement = document.querySelector('meta[name="csrf-token"]');
    return tokenElement ? tokenElement.getAttribute('content') : '';
};

export default function Staff({ errors }: { errors: Record<string, string[]> }) {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingUserData, setEditingUserData] = useState<Partial<User>>({});
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [updateErrors, setUpdateErrors] = useState<Record<string, string[]>>({});
    const [searching, setSearching] = useState(false);
    const [showActive, setShowActive] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        const status = showActive ? 'active' : 'inactive';
        axios
            .get(`/api/staff?status=${status}`)
            .then((response) => {
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
                setRoles(response.data.roles);
                setPlaces(response.data.places);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const csrfToken = getCsrfToken();
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        fetchUsers();
    }, [showActive]);

    const handleEditClick = (user: User) => {
        setEditingUserId(user.id);
        setEditingUserData(user);
    };

    const handleSaveClick = () => {
        if (!editingUserId) return;
        const csrfToken = getCsrfToken();
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        axios.patch(`/api/staff/${editingUserId}`, editingUserData)
            .then(response => {
                // Assuming the response is the updated user object
                setUsers(currentUsers => {
                    const updatedUsers = currentUsers.map(user =>
                        user.id === editingUserId ? response.data : user
                    );
                    setFilteredUsers(updatedUsers.filter(user =>
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    ));
                    return updatedUsers;
                });
                setEditingUserId(null);
                setUpdateErrors({});
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    setUpdateErrors(error.response.data.errors);
                } else {
                    console.error('Error updating user:', error);
                }
            });
    };

    const toggleForm = () => setIsFormOpen((prev) => !prev);
    const closeForm = () => setIsFormOpen(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            const status = showActive ? 'active' : 'inactive';
            if (searchQuery) {
                setSearching(true);
                axios.get(`/api/staff/search?query=${searchQuery}&status=${status}`)
                    .then(response => {
                        setFilteredUsers(response.data);
                    })
                    .catch(error => {
                        console.error('Error searching users:', error);
                    })
                    .finally(() => {
                        setSearching(false);
                    });
            } else {
                fetchUsers();
            }
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, showActive]);

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

    const handleRoleChange = (role: Role) => {
        const currentRoles = editingUserData.roles || [];
        const newRoles = currentRoles.some(r => r.id === role.id)
            ? currentRoles.filter(r => r.id !== role.id)
            : [...currentRoles, role];
        setEditingUserData({ ...editingUserData, roles: newRoles });
    };

    const handlePlaceChange = (place: Place) => {
        const currentPlaces = editingUserData.places || [];
        const newPlaces = currentPlaces.some(p => p.id === place.id)
            ? currentPlaces.filter(p => p.id !== place.id)
            : [...currentPlaces, place];
        setEditingUserData({ ...editingUserData, places: newPlaces });
    };

    const confirmDelete = () => {
        const csrfToken = getCsrfToken();
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
        axios.delete('/api/staff', { data: { ids: selectedUserIds } })
            .then(() => {
                fetchUsers(); // Reload users after successful deletion
                setSelectedUserIds([]);
                setIsConfirmingDelete(false);
            })
            .catch(error => {
                console.error('Error deleting users:', error);
                setIsConfirmingDelete(false);
            });
    };

    if (loading) {
        return (
            <Layout breadcrumbs={breadcrumbs}>
                <div className="p-4 md:p-6 flex justify-center items-center h-screen">
                    <Spinner/>
                </div>
            </Layout>
        );
    }

    return (
        <Layout breadcrumbs={breadcrumbs} className="bg-[--pastel-orange]">
            <div className="p-4 md:p-6">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center">
                    <div className="mt-4 flex w-full items-center space-x-2 sm:mt-0 sm:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar personal..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searching && <Spinner className="absolute" />}
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
                                            />
                                            <Label htmlFor="active-users">
                                                {showActive ? 'Mostrando activos' : 'Mostrando inactivos'}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="border-b">
                    <div className="hidden sm:flex items-center bg-gray-50 p-4 dark:bg-neutral-800">
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
                                User
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
                    <StaffListItem
                        users={filteredUsers}
                        roles={roles}
                        places={places}
                        selectedUserIds={selectedUserIds}
                        editingUserId={editingUserId}
                        editingUserData={editingUserData}
                        updateErrors={updateErrors}
                        handleSelectUser={handleSelectUser}
                        handleEditClick={handleEditClick}
                        handleSaveClick={handleSaveClick}
                        setEditingUserId={setEditingUserId}
                        setEditingUserData={setEditingUserData}
                        handleRoleChange={handleRoleChange}
                        handlePlaceChange={handlePlaceChange}
                    />
                </div>
                <div className="fixed right-6 bottom-6 z-50 flex space-x-4">
                    {selectedUserIds.length > 0 && (
                        <AlertDialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
                            <AlertDialogTrigger asChild>
                                <FloatingDeleteButton
                                    onClick={() => setIsConfirmingDelete(true)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                </FloatingDeleteButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Está seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. El usuario quedara inactivo y se eliminaran lo(s) rol(es) y la(s) sucursal(es) asignados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {!isFormOpen && (
                        <FloatingActionButton onClick={toggleForm} />
                    )}
                </div>
            </div>
            {
                isFormOpen && (
                    <div
                        className="bg-opacity-30 fixed inset-0 z-40"
                        onClick={closeForm}
                    ></div>
                )
            }
            {
                isFormOpen && (
                    <StaffForm
                        onClose={closeForm}
                        roles={roles}
                        places={places}
                        onStaffAdded={fetchUsers}
                        fetchPlaces={()=>{}}
                    />
                )
            }
        </Layout>
    )
}