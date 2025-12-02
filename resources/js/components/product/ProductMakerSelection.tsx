import { MakerManagerModal } from '@/components/MakerManagerModal'; // Will create this later
import { EditableField } from '@/components/EditableField';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Using DropdownMenuItem for single select
import { Maker, Product } from '@/types';
import { Pencil } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface ProductMakerSelectionProps {
  editedProduct: Product | Partial<Product>;
  setEditedProduct: React.Dispatch<
    React.SetStateAction<Product | Partial<Product>>
  >;
  allMakers: Maker[];
  setAllMakers: (makers: Maker[]) => void; // This is the local setter for allMakers in ProductForm
  setAllMakersInParent: (makers: Maker[]) => void; // This is the setter from ProductsPage
}

export function ProductMakerSelection({
  editedProduct,
  setEditedProduct,
  allMakers,
  setAllMakers, // Local setter from ProductForm
  setAllMakersInParent, // Setter from ProductsPage
}: ProductMakerSelectionProps) {
  const [isMakerModalOpen, setIsMakerModalOpen] = useState(false);

  const fetchMakers = useCallback(async () => {
    try {
      const response = await fetch('/api/makers');
      if (response.ok) {
        const data = await response.json();
        setAllMakers(data); // Update local state for immediate display
        setAllMakersInParent(data); // Update parent's state
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch makers:', error);
    }
    return null;
  }, [setAllMakers, setAllMakersInParent]); // Added setAllMakersInParent to deps

  const handleMakerModalClose = async (needsUpdate: boolean) => {
    setIsMakerModalOpen(false);
    if (needsUpdate) {
      await fetchMakers(); // Call fetchMakers to update state directly
      // No need to refresh selected maker, as it's a single selection by ID.
      // If the selected maker was deleted, maker_id will become invalid,
      // which should be handled by validation or UI (e.g., show "Maker Not Found").
    }
  };

  const handleMakerChange = (makerId: number | null) => {
    setEditedProduct({ ...editedProduct, maker_id: makerId });
  };

  const selectedMaker = allMakers.find(
    (maker) => maker.id === editedProduct.maker_id,
  );

  return (
    <>
      <MakerManagerModal // Will create this component
        open={isMakerModalOpen}
        onClose={handleMakerModalClose}
      />
      <EditableField label="Fabricante">
        <>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  {selectedMaker ? selectedMaker.name : 'Seleccionar Fabricante'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleMakerChange(null)}>
                  -- Ninguno --
                </DropdownMenuItem>
                {allMakers.map((maker) => (
                  <DropdownMenuItem
                    key={maker.id}
                    onClick={() => handleMakerChange(maker.id)}
                  >
                    {maker.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMakerModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          {selectedMaker && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm">
                {selectedMaker.name} ({selectedMaker.origin})
              </span>
            </div>
          )}
        </>
      </EditableField>
    </>
  );
}
