import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Maker } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface MakerManagerModalProps {
  open: boolean;
  onClose: (needsUpdate: boolean) => void;
}

export function MakerManagerModal({ open, onClose }: MakerManagerModalProps) {
  const [makers, setMakers] = useState<Maker[]>([]);
  const [editingMaker, setEditingMaker] = useState<Partial<Maker>>({
    name: '',
    origin: '',
  });
  const [hasChanged, setHasChanged] = useState(false);

  const fetchMakers = useCallback(async () => {
    try {
      const response = await fetch('/api/makers');
      if (response.ok) {
        const data = await response.json();
        setMakers(data);
      }
    } catch (error) {
      console.error('Failed to fetch makers:', error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      (async () => {
        await fetchMakers();
      })();
    }
  }, [open, fetchMakers]);

  const handleSave = async () => {
    const method = editingMaker.id ? 'PUT' : 'POST';
    const url = editingMaker.id
      ? `/api/makers/${editingMaker.id}`
      : '/api/makers';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (
            document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
          )?.content,
        },
        body: JSON.stringify({
          name: editingMaker.name,
          origin: editingMaker.origin,
        }),
      });

      if (response.ok) {
        setEditingMaker({ name: '', origin: '' });
        fetchMakers();
        setHasChanged(true);
      } else {
        console.error('Failed to save maker');
      }
    } catch (error) {
      console.error('Failed to save maker:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro que quieres eliminar este fabricante?')) {
      return;
    }

    try {
      const response = await fetch(`/api/makers/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': (
            document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
          )?.content,
        },
      });

      if (response.ok) {
        fetchMakers();
        setHasChanged(true);
      } else {
        console.error('Failed to delete maker');
      }
    } catch (error) {
      console.error('Failed to delete maker:', error);
    }
  };

  const handleClose = () => {
    onClose(hasChanged);
    setHasChanged(false);
    setEditingMaker({ name: '', origin: '' });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Fabricantes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 rounded-lg border p-2">
            <Input
              placeholder="Nombre Fabricante (e.g. Apple)"
              value={editingMaker.name || ''}
              onChange={(e) =>
                setEditingMaker({ ...editingMaker, name: e.target.value })
              }
            />
            <Input
              placeholder="Origen (e.g. USA)"
              value={editingMaker.origin || ''}
              onChange={(e) =>
                setEditingMaker({ ...editingMaker, origin: e.target.value })
              }
            />
            <Button onClick={handleSave}>
              {editingMaker.id ? 'Actualizar' : 'Agregar'}
            </Button>
            {editingMaker.id && (
              <Button
                variant="ghost"
                onClick={() => setEditingMaker({ name: '', origin: '' })}
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {makers.map((maker) => (
              <div
                key={maker.id}
                className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{maker.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {maker.origin}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingMaker(maker)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(maker.id)}
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
