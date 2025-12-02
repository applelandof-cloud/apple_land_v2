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
import {
  deleteCategory,
  getCategories,
  saveCategory,
} from '@/services/categoryService';
import { Category } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ValidationErrors {
  [key: string]: string[];
}

interface CategoryManagerModalProps {
  open: boolean;
  onClose: (needsUpdate: boolean) => void;
}

export function CategoryManagerModal({
  open,
  onClose,
}: CategoryManagerModalProps) {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({
    name: '',
  });
  const [hasChanged, setHasChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const fetchCategories = useCallback(async () => {
    const categories = await getCategories();
    setCategories(categories);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (open) {
      (async () => {
        await fetchCategories();
      })();
    }

    return () => {
      controller.abort();
    };
  }, [open, fetchCategories]);

  const handleEditingCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setEditingCategory((prev) => ({ ...prev, [name]: value }));
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
      id: editingCategory.id,
      name: editingCategory.name,
    };

    const result = await saveCategory(data);
    if (result && 'errors' in result && result.errors) {
      setValidationErrors(result.errors);
    } else if (result && 'message' in result && result.message) {
      showErrorToast(result.message, result.error || 'Error del Servidor');
    } else {
      setEditingCategory({ name: '' });
      await fetchCategories();
      setHasChanged(true);
      showSuccessToast(
        'Categoría guardada exitosamente.',
        'Categoría guardada',
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory(id);
      await fetchCategories();
      setHasChanged(true);
      showSuccessToast(
        'Categoría ha sido eliminado exitosamente.',
        'Categoría eliminada',
      );
    } catch (error) {
      showErrorToast('Error al eliminar la categoría.', 'Error de Eliminación');
      console.error('Failed to delete category:', error);
    }
  };

  const handleClose = () => {
    onClose(hasChanged);
    setHasChanged(false);
    setEditingCategory({ name: '' });
    setValidationErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-2">
            <div className="flex items-start gap-2">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Nombre Categoria (e.g. Laptops)"
                  value={editingCategory.name || ''}
                  onChange={handleEditingCategoryChange}
                  className={
                    validationErrors.name && validationErrors.name.length > 0
                      ? 'border-red-500'
                      : ''
                  }
                />
                {validationErrors.name && validationErrors.name.length > 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.name.join(', ')}
                  </p>
                )}
              </div>
              <Button onClick={handleSave}>
                {editingCategory.id ? 'Actualizar' : 'Agregar'}
              </Button>
              {editingCategory.id && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingCategory({ name: '' });
                    setValidationErrors({});
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category);
                      setValidationErrors({});
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
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
