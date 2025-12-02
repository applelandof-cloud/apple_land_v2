import { ColorManagerModal } from '@/components/color/ColorManagerModal';
import { EditableField } from '@/components/EditableField';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Color, Product } from '@/types';
import { Pencil } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface ProductColorSelectionProps {
  editedProduct: Product | Partial<Product>;
  setEditedProduct: React.Dispatch<
    React.SetStateAction<Product | Partial<Product>>
  >;
  allColors: Color[];
  setAllColors: (colors: Color[]) => void;
}

export function ProductColorSelection({
  editedProduct,
  setEditedProduct,
  allColors,
  setAllColors,
}: ProductColorSelectionProps) {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const fetchColors = useCallback(async () => {
    try {
      const response = await fetch('/api/colors');
      if (response.ok) {
        const data = await response.json();
        setAllColors(data);
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch colors:', error);
    }
    return null;
  }, [setAllColors]);

  const handleColorModalClose = async (needsUpdate: boolean) => {
    setIsColorModalOpen(false);
    if (needsUpdate) {
      const newAllColors: Color[] = await fetchColors();
      if (newAllColors) {
        const refreshedSelectedColors =
          editedProduct.colors
            ?.map((selectedColor) =>
              newAllColors.find((c) => c.id === selectedColor.id),
            )
            .filter((color): color is Color => color !== undefined) || [];

        setEditedProduct((prev) => ({
          ...prev,
          colors: refreshedSelectedColors,
        }));
      }
    }
  };

  const handleColorChange = (color: Color) => {
    const currentColors = editedProduct.colors || [];
    const newColors = currentColors.some((c) => c.id === color.id)
      ? currentColors.filter((c) => c.id !== color.id)
      : [...currentColors, color];
    setEditedProduct({ ...editedProduct, colors: newColors });
  };

  return (
    <>
      <ColorManagerModal
        open={isColorModalOpen}
        onClose={handleColorModalClose}
      />
      <EditableField label="Colores">
        <>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  Seleccionar Colores
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allColors.map((color) => (
                  <DropdownMenuCheckboxItem
                    key={color.id}
                    checked={(editedProduct.colors || []).some(
                      (c) => c.id === color.id,
                    )}
                    onCheckedChange={() => handleColorChange(color)}
                    className="flex items-center"
                  >
                    <span
                      className="mr-2 h-4 w-4 rounded-full border"
                      style={{ backgroundColor: color.hex_code }}
                    ></span>
                    {color.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsColorModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(editedProduct.colors || []).map((color) => (
              <span
                key={color.id}
                className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
                style={{
                  backgroundColor: color.hex_code
                    ? `${color.hex_code}20`
                    : 'transparent',
                }}
              >
                <span
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: color.hex_code }}
                ></span>
                {color.name}
              </span>
            ))}
          </div>
        </>
      </EditableField>
    </>
  );
}
