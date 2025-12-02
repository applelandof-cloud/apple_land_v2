import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Switch from '@/components/ui/switch';
import { EditableField } from '@/components/EditableField';
import { MultiSelectDropdown } from '@/components/custom/MultiSelectDropdown';
import { Place, Role, User } from '@/types';
import { Check, Pencil, X } from 'lucide-react';
import { ChangeEvent } from 'react';

interface EditStaffFormProps {
    editingUserData: Partial<User>;
    roles: Role[];
    places: Place[];
    handleSaveClick: () => void;
    setEditingUserId: (userId: number | null) => void;
    setEditingUserData: (userData: Partial<User>) => void;
    handleRoleChange: (roleId: string) => void;
    handlePlaceChange: (placeId: string) => void;
    setIsPlaceManagerModalOpen: (isOpen: boolean) => void;
    handleChangePasswordClick: (userId: number) => void;
    errors: Record<string, string[]>;
}

export default function EditStaffForm({
    editingUserData,
    roles,
    places,
    handleSaveClick,
    setEditingUserId,
    setEditingUserData,
    handleRoleChange,
    handlePlaceChange,
    setIsPlaceManagerModalOpen,
    handleChangePasswordClick,
    errors,
}: EditStaffFormProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingUserData({
            ...editingUserData,
            [name]: value,
        });
    };

    return (
        <div className="ml-4 grid flex-1 grid-cols-2 items-center gap-4 md:grid-cols-9">
            <div className="col-span-2">
                <EditableField label="Nombre">
                    <Input
                        type="text"
                        name="name"
                        value={editingUserData.name}
                        onChange={handleInputChange}
                    />
                </EditableField>
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}

                <EditableField label="Apellido">
                    <Input
                        type="text"
                        name="last_name"
                        value={editingUserData.last_name}
                        onChange={handleInputChange}
                        className="mt-2"
                    />
                </EditableField>
                {errors?.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}

                <EditableField label="Username">
                    <Input
                        type="text"
                        name="username"
                        value={editingUserData.username}
                        onChange={handleInputChange}
                        className="mt-2"
                    />
                </EditableField>
                {errors?.username && <p className="text-red-500 text-xs mt-1">{errors.username[0]}</p>}

                <EditableField label="Email">
                    <Input
                        type="email"
                        name="email"
                        value={editingUserData.email}
                        onChange={handleInputChange}
                        className="mt-2"
                    />
                </EditableField>
                {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}

                <EditableField label="C.I.">
                    <Input
                        type="identification"
                        name="identification"
                        value={editingUserData.identification}
                        onChange={handleInputChange}
                        className="mt-2"
                    />
                </EditableField>
                {errors?.identification && <p className="text-red-500 text-xs mt-1">{errors.identification[0]}</p>}

                <EditableField label="Telefono">
                    <Input
                        type="phone_number"
                        name="phone_number"
                        value={editingUserData.phone_number}
                        onChange={handleInputChange}
                        className="mt-2"
                    />
                </EditableField>
                {errors?.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number[0]}</p>}
            </div>
            <div className="col-span-2">
                <MultiSelectDropdown
                    items={roles}
                    selectedIds={(editingUserData.roles || []).map((r) =>
                        r.id.toString(),
                    )}
                    onSelectionChange={handleRoleChange}
                    placeholder="Seleccionar Roles"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {(editingUserData.roles || []).map((role) => (
                        <Badge key={role.id} variant="secondary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="col-span-2">
                <div className="flex items-center">
                    <MultiSelectDropdown
                        items={places}
                        selectedIds={(editingUserData.places || []).map((p) =>
                            p.id.toString(),
                        )}
                        onSelectionChange={handlePlaceChange}
                        placeholder="Seleccionar Sucursales"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => setIsPlaceManagerModalOpen(true)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {(editingUserData.places || []).map((place) => (
                        <Badge key={place.id} variant="outline">
                            {place.name}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="col-span-1 flex items-center gap-2">
                <Switch
                    checked={editingUserData.is_active ?? false}
                    onCheckedChange={(checked) =>
                        setEditingUserData({
                            ...editingUserData,
                            is_active: checked,
                        })
                    }
                    className={
                        editingUserData.is_active === true
                            ? 'bg-green-500'
                            : 'bg-red-500'
                    }
                />
                <span className="text-xs">
                    {editingUserData.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </div>
            <div className="col-span-1">
                <div className="mb-2 flex w-full items-center justify-between gap-2">
                    <Button
                        variant="default"
                        onClick={handleSaveClick}
                        className="w-full"
                    >
                        <Check className="h-4 w-4 lg:h-5 lg:w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setEditingUserId(null)}
                        className="w-full"
                    >
                        <X className="h-4 w-4 lg:h-5 lg:w-5" />
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={() =>
                        handleChangePasswordClick(editingUserData.id!)
                    }
                    className="w-full"
                >
                    Cambiar Password
                </Button>
            </div>
        </div>
    );
}
