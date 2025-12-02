import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Place } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

interface PlaceManagerModalProps {
    open: boolean;
    onClose: (needsUpdate: boolean) => void;
}

export function PlaceManagerModal({ open, onClose }: PlaceManagerModalProps) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [editingPlace, setEditingPlace] = useState<Partial<Place>>({ name: '', address: '' });
    const [hasChanged, setHasChanged] = useState(false);

    const fetchPlaces = useCallback(async () => {
        try {
            const response = await axios.get('/api/places');
            setPlaces(response.data);
        } catch (error) {
            console.error('Failed to fetch places:', error);
        }
    }, []);

    useEffect(() => {
        if (open) {
            (async () => {
                await fetchPlaces();
            })();
        }
    }, [open, fetchPlaces]);

    const handleSave = async () => {
        const url = editingPlace.id ? `/api/places/${editingPlace.id}` : '/api/places';

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const headers = {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            };

            const data = { name: editingPlace.name, address: editingPlace.address };

            if (editingPlace.id) {
                await axios.patch(url, data, { headers });
            } else {
                await axios.post(url, data, { headers });
            }

            setEditingPlace({ name: '', address: '' });
            fetchPlaces();
            setHasChanged(true);
        } catch (error) {
            console.error('Failed to save place:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Estas seguro que deseas eliminar este elemento?')) {
            return;
        }

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const headers = {
                'X-CSRF-TOKEN': csrfToken,
            };
            await axios.delete(`/api/places/${id}`, { headers });
            fetchPlaces();
            setHasChanged(true);
        } catch (error) {
            console.error('Failed to delete place:', error);
        }
    };

    const handleClose = () => {
        onClose(hasChanged);
        setHasChanged(false);
        setEditingPlace({ name: '', address: '' });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Sucursales</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex flex-col gap-2 p-2 border rounded-lg">
                        <Input
                            placeholder="Nombre Sucursal (e.g. Bodega Central)"
                            value={editingPlace.name || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                        />
                        <Input
                            placeholder="Dirección Sucursal"
                            value={editingPlace.address || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, address: e.target.value })}
                        />
                        <Button onClick={handleSave}>{editingPlace.id ? 'Actualizar' : 'Agregar'}</Button>
                        {editingPlace.id && (
                            <Button variant="ghost" onClick={() => setEditingPlace({ name: '', address: '' })}>
                                Cancelar
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {places.map((place) => (
                            <div key={place.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50">
                                <div className="flex flex-col">
                                    <span className="font-medium">{place.name}</span>
                                    <span className="text-sm text-muted-foreground">{place.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingPlace(place)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(place.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
