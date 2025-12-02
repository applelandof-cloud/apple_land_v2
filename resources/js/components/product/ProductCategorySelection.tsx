import { CategoryManagerModal } from '@/components/category/CategoryManagerModal';
import { EditableField } from '@/components/EditableField';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category, Product } from '@/types';
import { Pencil } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface ProductCategorySelectionProps {
  editedProduct: Product | Partial<Product>;
  setEditedProduct: React.Dispatch<
    React.SetStateAction<Product | Partial<Product>>
  >;
  allCategories: Category[];
  setAllCategories: (categories: Category[]) => void;
}

export function ProductCategorySelection({
  editedProduct,
  setEditedProduct,
  allCategories,
  setAllCategories,
}: ProductCategorySelectionProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setAllCategories(data.categories);
        return data.categories;
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
    return null;
  }, [setAllCategories]);

  const handleCategoryModalClose = async (needsUpdate: boolean) => {
    setIsCategoryModalOpen(false);
    if (needsUpdate) {
      const newAllCategories: Category[] = await fetchCategories();
      if (newAllCategories) {
        const refreshedSelectedCategories =
          editedProduct.categories
            ?.map((selectedCategory) =>
              newAllCategories.find((c) => c.id === selectedCategory.id),
            )
            .filter((category): category is Category => category !== undefined) || [];

        setEditedProduct((prev) => ({
          ...prev,
          categories: refreshedSelectedCategories,
        }));
      }
    }
  };

  const handleCategoryChange = (category: Category) => {
    const currentCategories = editedProduct.categories || [];
    const newCategories = currentCategories.some((c) => c.id === category.id)
      ? currentCategories.filter((c) => c.id !== category.id)
      : [...currentCategories, category];
    setEditedProduct({ ...editedProduct, categories: newCategories });
  };

  return (
    <>
      <CategoryManagerModal
        open={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
      />
      <EditableField label="Categorias">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
              >
                Seleccionar Categorias
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {allCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={(editedProduct.categories || []).some(
                    (c) => c.id === category.id,
                  )}
                  onCheckedChange={() => handleCategoryChange(category)}
                  className="flex items-center"
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(editedProduct.categories || []).map((category) => (
            <span
              key={category.id}
              className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
            >
              {category.name}
            </span>
          ))}
        </div>
      </EditableField>
    </>
  );
}