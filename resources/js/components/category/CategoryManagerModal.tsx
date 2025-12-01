import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

interface CategoryManagerModalProps {
  open: boolean;
  onClose: (needsUpdate: boolean) => void;
}

export function CategoryManagerModal({ open, onClose }: CategoryManagerModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({
    name: '',
  });
  const [hasChanged, setHasChanged] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const handleSave = async () => {
    const method = editingCategory.id ? 'PUT' : 'POST';
    const url = editingCategory.id
      ? `/api/categories/${editingCategory.id}`
      : '/api/categories';

    try {
      const response = await axios({
        method,
        url,
        data: {
          name: editingCategory.name,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setEditingCategory({ name: '' });
        fetchCategories();
        setHasChanged(true);
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/categories/${id}`);

      if (response.status === 204) {
        fetchCategories();
        setHasChanged(true);
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleClose = () => {
    onClose(hasChanged);
    setHasChanged(false);
    setEditingCategory({ name: '' });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 rounded-lg border p-2">
            <Input
              placeholder="Nombre Categoria (e.g. Laptops)"
              value={editingCategory.name || ''}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
            />
            <Button onClick={handleSave}>
              {editingCategory.id ? 'Actualizar' : 'Agregar'}
            </Button>
            {editingCategory.id && (
              <Button
                variant="ghost"
                onClick={() => setEditingCategory({ name: '' })}
              >
                Cancelar
              </Button>
            )}
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
                    onClick={() => setEditingCategory(category)}
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