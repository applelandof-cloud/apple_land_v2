import { MultiSelectDropdown } from '@/components/custom/MultiSelectDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Place, Role, User } from '@/types';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface CreateStaffFormProps {
    newUser: Partial<User>;
    roles: Role[];
    places: Place[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRoleChange: (roleId: string) => void;
    handlePlaceChange: (placeId: string) => void;
    handleSaveNewUser: () => void;
    handleCancel: () => void;
    errors: Record<string, string[]>;
}

export default function CreateStaffForm({
    newUser,
    roles,
    places,
    handleInputChange,
    handleRoleChange,
    handlePlaceChange,
    handleSaveNewUser,
    handleCancel,
    errors,
}: CreateStaffFormProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800">
                <h2 className="mb-4 text-xl font-semibold">Nuevo Usuario</h2>

                <div>
                    <h3 className="mb-2 text-lg font-medium">Información Personal</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Nombre"
                                value={newUser.name || ''}
                                onChange={handleInputChange}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="last_name">Apellido</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                placeholder="Apellido"
                                value={newUser.last_name || ''}
                                onChange={handleInputChange}
                            />
                            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="identification">C.I.</Label>
                            <Input
                                id="identification"
                                name="identification"
                                placeholder="C.I."
                                value={newUser.identification || ''}
                                onChange={handleInputChange}
                            />
                            {errors.identification && <p className="text-red-500 text-xs mt-1">{errors.identification[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="phone_number">Telefono</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                placeholder="Telefono"
                                value={newUser.phone_number || ''}
                                onChange={handleInputChange}
                            />
                            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number[0]}</p>}
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                <div>
                    <h3 className="mb-2 text-lg font-medium">Información de la Cuenta</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={newUser.username || ''}
                                onChange={handleInputChange}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={newUser.email || ''}
                                onChange={handleInputChange}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="roles">Roles</Label>
                            <MultiSelectDropdown
                                items={roles}
                                selectedIds={
                                    newUser.roles
                                        ? newUser.roles.map((r) => r.id.toString())
                                        : []
                                }
                                onSelectionChange={handleRoleChange}
                                placeholder="Seleccionar Roles"
                            />
                            {errors.roles && <p className="text-red-500 text-xs mt-1">{errors.roles[0]}</p>}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {newUser.roles &&
                                    newUser.roles.map((role) => (
                                        <Badge key={role.id} variant="secondary">
                                            {role.name}
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="places">Sucursales</Label>
                            <MultiSelectDropdown
                                items={places}
                                selectedIds={
                                    newUser.places
                                        ? newUser.places.map((p) => p.id.toString())
                                        : []
                                }
                                onSelectionChange={handlePlaceChange}
                                placeholder="Seleccionar Sucursales"
                            />
                            {errors.places && <p className="text-red-500 text-xs mt-1">{errors.places[0]}</p>}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {newUser.places &&
                                    newUser.places.map((place) => (
                                        <Badge key={place.id} variant="outline">
                                            {place.name}
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveNewUser}>
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
    );
}