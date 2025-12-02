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
import { deleteColor, getColors, saveColor } from '@/services/colorService';
import { Color } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ColorManagerModalProps {
  open: boolean;
  onClose: (needsUpdate: boolean) => void;
}

export function ColorManagerModal({ open, onClose }: ColorManagerModalProps) {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [colors, setColors] = useState<Color[]>([]);
  const [editingColor, setEditingColor] = useState<Partial<Color>>({
    name: '',
    hex_code: '',
  });
  const [hasChanged, setHasChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const fetchColors = useCallback(async () => {
    const colors = await getColors();
    setColors(colors);
  }, []);

  useEffect(() => {
    if (open) {
      (async () => {
        await fetchColors();
      })();
    }
  }, [open, fetchColors]);

  const handleEditingColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingColor((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    setValidationErrors({});

    const data = {
      id: editingColor.id,
      name: editingColor.name,
      hex_code: editingColor.hex_code,
    };

    const result = await saveColor(data);
    if (result && 'errors' in result && result.errors) {
      setValidationErrors(result.errors);
    } else if (result && 'message' in result && result.message) {
      showErrorToast(result.message, result.error || 'Error del Servidor');
    } else {
      setEditingColor({ name: '', hex_code: '' });
      await fetchColors();
      setHasChanged(true);
      showSuccessToast(
        'El color ha sido guardado exitosamente.',
        'Color guardado',
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Estas seguro que deseas eliminar este elemento?')) {
      return;
    }

    await deleteColor(id);
    await fetchColors();
    setHasChanged(true);
    showSuccessToast(
      'El color ha sido eliminado exitosamente.',
      'Color eliminado',
    );
  };

  const handleClose = () => {
    onClose(hasChanged);
    setHasChanged(false);
    setEditingColor({ name: '', hex_code: '' });
    setValidationErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Colores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2 rounded-lg border p-2">
            <div>
              <Input
                name="name"
                placeholder="Nombre Color (e.g. Verde)"
                value={editingColor.name || ''}
                onChange={handleEditingColorChange}
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {validationErrors.name.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Input
                name="hex_code"
                placeholder="#RRGGBB"
                value={editingColor.hex_code || ''}
                onChange={handleEditingColorChange}
                className={validationErrors.hex_code ? 'border-red-500' : ''}
              />
              {validationErrors.hex_code && (
                <p className="mt-1 text-sm text-destructive">
                  {validationErrors.hex_code.join(', ')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingColor.id ? 'Actualizar' : 'Agregar'}
              </Button>
              {editingColor.id && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingColor({ name: '', hex_code: '' });
                    setValidationErrors({});
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
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
