import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { deletePlace, getPlaces, savePlace } from '@/services/placeService';
import { Place } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ValidationErrors {
  [key: string]: string[];
}

interface PlaceManagerModalProps {
  open: boolean;
  onClose: (needsUpdate: boolean) => void;
}

export function PlaceManagerModal({ open, onClose }: PlaceManagerModalProps) {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [places, setPlaces] = useState<Place[]>([]);
  const [editingPlace, setEditingPlace] = useState<Partial<Place>>({
    name: '',
    address: '',
  });
  const [hasChanged, setHasChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const fetchPlaces = useCallback(async () => {
    const places = await getPlaces();
    setPlaces(places);
  }, []);

  useEffect(() => {
    if (open) {
      (async () => {
        fetchPlaces();
      })();
    }
  }, [open, fetchPlaces]);

  const handleSave = async () => {
    setValidationErrors({});

    const data = {
      id: editingPlace.id,
      name: editingPlace.name,
      address: editingPlace.address,
    };

    const result = await savePlace(data);
    if (result && 'errors' in result && result.errors) {
      setValidationErrors(result.errors);
    } else if (result && 'message' in result && result.message) {
      showErrorToast(result.message, result.error || 'Error del Servidor');
    } else {
      setEditingPlace({ name: '', address: '' });
      await fetchPlaces();
      setHasChanged(true);
      showSuccessToast(
        'La Sucursal ha sido guardada exitosamente.',
        'Sucursal guardada',
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Estas seguro que deseas eliminar este elemento?')) {
      return;
    }

    await deletePlace(id);
    await fetchPlaces();
    setHasChanged(true);
    showSuccessToast('Sucursal eliminada exitosamente.', 'Sucursal Eliminada');
  };

  const handleClose = () => {
    onClose(hasChanged);
    setHasChanged(false);
    setEditingPlace({ name: '', address: '' });
    setValidationErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingPlace((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Sucursales</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2 rounded-lg border p-2">
            <div>
              <Input
                name="name"
                placeholder="Nombre Sucursal (e.g. Bodega Central)"
                value={editingPlace.name || ''}
                onChange={handleInputChange}
                className={validationErrors.address ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.name.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Input
                name="address"
                placeholder="Dirección Sucursal"
                value={editingPlace.address || ''}
                onChange={handleInputChange}
                className={validationErrors.address ? 'border-red-500' : ''}
              />
              {validationErrors.address && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.address.join(', ')}
                </p>
              )}
            </div>
            <Button onClick={handleSave}>
              {editingPlace.id ? 'Actualizar' : 'Agregar'}
            </Button>
            {editingPlace.id && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingPlace({ name: '', address: '' });
                  setValidationErrors({});
                }}
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{place.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {place.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPlace(place)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(place.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
