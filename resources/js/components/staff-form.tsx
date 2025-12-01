import Button from './Button';
import { X } from 'lucide-react';
import { Place, Role } from '@/types';
import { useForm } from '@inertiajs/react';
import InputError from './input-error';

interface StaffFormProps {
    onClose: () => void;
    roles: Role[];
    places: Place[];
}

export default function StaffForm({ onClose, roles, places }: StaffFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        last_name: '',
        identification: '',
        phone_number: '',
        username: '',
        email: '',
        password: '',
        role_id: '',
        place_id: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/staff/store', {
            onSuccess: () => onClose(),
        });
    }

    return (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-neutral-900 shadow-lg p-6 z-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Registrar Usuario</h2>
                <button onClick={onClose}>
                    <X className="h-6 w-6" />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información Personal</h3>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <input type="text" placeholder="Nombre" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.name} onChange={e => setData('name', e.target.value)} />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="flex-1">
                            <input type="text" placeholder="Apellido" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <input type="text" placeholder="C.I." className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.identification} onChange={e => setData('identification', e.target.value)} />
                            <InputError message={errors.identification} className="mt-2" />
                        </div>
                        <div className="flex-1">
                            <input type="text" placeholder="Teléfono" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Información de la Cuenta</h3>
                    <div className="mb-4">
                        <input type="text" placeholder="Username" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.username} onChange={e => setData('username', e.target.value)} />
                        <InputError message={errors.username} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <input type="email" placeholder="Email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.email} onChange={e => setData('email', e.target.value)} />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <input type="password" placeholder="Password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.password} onChange={e => setData('password', e.target.value)} />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.role_id} onChange={e => setData('role_id', e.target.value)}>
                                <option value="">Seleccionar rol</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.role_id} className="mt-2" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sucursal</label>
                            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md" value={data.place_id} onChange={e => setData('place_id', e.target.value)}>
                                <option value="">Seleccionar sucursal</option>
                                {places.map(place => (
                                    <option key={place.id} value={place.id}>{place.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.place_id} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancelar</button>
                    <Button type="submit" disabled={processing}>Guardar</Button>
                </div>
            </form >
        </div >
    );
}
