import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, X } from 'lucide-react';
import { Place, Role } from '@/types';
import { useState } from 'react';
import axios from 'axios';
import InputError from '../input-error';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import PasswordVisibilityToggle from '../password-visibility-toggle';
import { PlaceManagerModal } from '../PlaceManagerModal';

interface StaffFormProps {
    onClose: () => void;
    roles: Role[];
    places: Place[];
    onStaffAdded: () => void;
    fetchPlaces: () => void; // Add fetchPlaces to props
}

export default function StaffForm({ onClose, roles, places, onStaffAdded, fetchPlaces }: StaffFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        identification: '',
        phone_number: '',
        username: '',
        email: '',
        password: '',
        role_ids: [] as string[],
        place_ids: [] as string[],
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isPlaceManagerModalOpen, setIsPlaceManagerModalOpen] = useState(false);

    const setData = (key: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleRoleChange = (roleId: string) => {
        const currentRoleIds = formData.role_ids || [];
        const newRoleIds = currentRoleIds.includes(roleId)
            ? currentRoleIds.filter(id => id !== roleId)
            : [...currentRoleIds, roleId];
        setData('role_ids', newRoleIds);
    };

    const handlePlaceChange = (placeId: string) => {
        const currentPlaceIds = formData.place_ids || [];
        const newPlaceIds = currentPlaceIds.includes(placeId)
            ? currentPlaceIds.filter(id => id !== placeId)
            : [...currentPlaceIds, placeId];
        setData('place_ids', newPlaceIds);
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({}); // Clear previous errors

        axios.post('/api/staff', formData)
            .then(() => {
                setProcessing(false);
                onClose(); // Close form on success
                onStaffAdded(); // Call the refresh function
            })
            .catch(error => {
                setProcessing(false);
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error('Error submitting form:', error);
                }
            });
    }

    return (
        <div className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-white dark:bg-neutral-900 shadow-lg p-6 z-50 overflow-y-auto">
            <PlaceManagerModal
                open={isPlaceManagerModalOpen}
                onClose={(needsUpdate) => {
                    setIsPlaceManagerModalOpen(false);
                    if (needsUpdate) {
                        fetchPlaces(); // Re-fetch places if an update occurred
                    }
                }}
            />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Registrar Usuario</h2>
                <button onClick={onClose}>
                    <X className="h-6 w-6" />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información Personal</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <Input type="text" placeholder="Nombre" value={formData.name} onChange={e => setData('name', e.target.value)} />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="flex-1">
                            <Input type="text" placeholder="Apellido" value={formData.last_name} onChange={e => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <Input type="text" placeholder="C.I." value={formData.identification} onChange={e => setData('identification', e.target.value)} />
                            <InputError message={errors.identification} className="mt-2" />
                        </div>
                        <div className="flex-1">
                            <Input type="text" placeholder="Teléfono" value={formData.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información de la Cuenta</h3>
                    <div className="mb-4">
                        <Input type="text" placeholder="Username" value={formData.username} onChange={e => setData('username', e.target.value)} />
                        <InputError message={errors.username} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <Input type="email" placeholder="Email" value={formData.email} onChange={e => setData('email', e.target.value)} />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="mb-4 relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pr-10"
                            value={formData.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        <PasswordVisibilityToggle
                            isVisible={showPassword}
                            onToggle={() => setShowPassword(prev => !prev)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mb-4 relative">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start font-normal">Seleccionar Roles</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {roles.map(role => (
                                        <DropdownMenuCheckboxItem
                                            key={role.id}
                                            checked={formData.role_ids.includes(role.id.toString())}
                                            onCheckedChange={() => handleRoleChange(role.id.toString())}
                                        >
                                            {role.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {formData.role_ids.map(roleId => {
                                    const role = roles.find(r => r.id.toString() === roleId);
                                    return (
                                        <span
                                            key={roleId}
                                            className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm bg-gray-200"
                                        >
                                            {role?.name}
                                        </span>
                                    );
                                })}
                            </div>
                            <InputError message={errors.role_ids} className="mt-2" />
                        </div>
                    </div>
                    <div className="mb-4 relative">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sucursal</label>
                            <div className="flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start font-normal">Seleccionar Sucursales</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {places.map(place => (
                                            <DropdownMenuCheckboxItem
                                                key={place.id}
                                                checked={formData.place_ids.includes(place.id.toString())}
                                                onCheckedChange={() => handlePlaceChange(place.id.toString())}
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
                                {formData.place_ids.map(placeId => {
                                    const place = places.find(p => p.id.toString() === placeId);
                                    return (
                                        <span
                                            key={placeId}
                                            className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm"
                                        >
                                            {place?.name}
                                        </span>
                                    );
                                })}
                            </div>
                            <InputError message={errors.place_ids} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancelar</button>
                    <Button type="submit" className="bg-black text-white border" disabled={processing}>Guardar</Button>
                </div>
            </form >
        </div >
    );
}
