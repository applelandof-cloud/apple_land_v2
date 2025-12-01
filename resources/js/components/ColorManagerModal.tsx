import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Color } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ColorManagerModalProps {
  open: boolean;
  onClose: (needsUpdate: boolean) => void;
}

export function ColorManagerModal({ open, onClose }: ColorManagerModalProps) {
  const [colors, setColors] = useState<Color[]>([]);
  const [editingColor, setEditingColor] = useState<Partial<Color>>({
    name: '',
    hex_code: '',
  });
  const [hasChanged, setHasChanged] = useState(false);

  const fetchColors = useCallback(async () => {
    try {
      const response = await fetch('/api/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data);
      }
    } catch (error) {
      console.error('Failed to fetch colors:', error);
    }
  }, []); // Empty dependency array as fetchColors doesn't depend on any changing props or state

  useEffect(() => {
    if (open) {
      (async () => {
        await fetchColors();
      })();
    }
  }, [open, fetchColors]); // fetchColors is now a stable dependency

  const handleSave = async () => {
    const method = editingColor.id ? 'PUT' : 'POST';
    const url = editingColor.id
      ? `/api/colors/${editingColor.id}`
      : '/api/colors';

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
          name: editingColor.name,
          hex_code: editingColor.hex_code,
        }),
      });

      if (response.ok) {
        setEditingColor({ name: '', hex_code: '' });
        fetchColors();
        setHasChanged(true);
      } else {
        console.error('Failed to save color');
      }
    } catch (error) {
      console.error('Failed to save color:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this color?')) {
      return;
    }

    try {
      const response = await fetch(`/api/colors/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': (
            document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
          )?.content,
        },
      });

      if (response.ok) {
        fetchColors();
        setHasChanged(true);
      } else {
        console.error('Failed to delete color');
      }
    } catch (error) {
      console.error('Failed to delete color:', error);
    }
  };

  const handleClose = () => {
    onClose(hasChanged);
    setHasChanged(false);
    setEditingColor({ name: '', hex_code: '' });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Colores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 rounded-lg border p-2">
            <Input
              placeholder="Nombre Color (e.g. Verde)"
              value={editingColor.name || ''}
              onChange={(e) =>
                setEditingColor({ ...editingColor, name: e.target.value })
              }
            />
            <Input
              placeholder="#RRGGBB"
              value={editingColor.hex_code || ''}
              onChange={(e) =>
                setEditingColor({ ...editingColor, hex_code: e.target.value })
              }
            />
            <Button onClick={handleSave}>
              {editingColor.id ? 'Actualizar' : 'Agregar'}
            </Button>
            {editingColor.id && (
              <Button
                variant="ghost"
                onClick={() => setEditingColor({ name: '', hex_code: '' })}
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-5 w-5 rounded-full border"
                    style={{ backgroundColor: color.hex_code }}
                  ></span>
                  <span className="font-medium">{color.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {color.hex_code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingColor(color)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(color.id)}
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
