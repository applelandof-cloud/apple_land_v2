import { Button } from '@/components/ui/button';
import {
  Category,
  Color,
  Currency,
  Maker,
  Product,
  ProductType,
} from '@/types';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductCategorySelection } from './ProductCategorySelection';
import { ProductColorSelection } from './ProductColorSelection';
import { ProductDetailsForm } from './ProductDetailsForm';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductMakerSelection } from './ProductMakerSelection'; // New import
import { ProductPriceInputs } from './ProductPriceInputs';

interface ProductFormProps {
  product: Product | Partial<Product>;
  onSave: (
    product: Product | Partial<Product>,
    newImageFiles: File[],
  ) => Promise<Record<string, string[]> | null>;
  onCancel: () => void;
  allMakers: Maker[]; // List of all makers from parent
  setAllMakersInParent: (makers: Maker[]) => void; // Parent's setter for all makers
  allCategories: Category[];
  allColors: Color[];
  setAllColorsInParent: (colors: Color[]) => void; // Parent's setter for all colors
  allCurrencies: Currency[];
  allProductTypes: ProductType[];
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  newImageFiles: File[];
  setNewImageFiles: (files: File[]) => void;
  newImagePreviews: string[];
  setNewImagePreviews: (previews: string[]) => void;
  handleNewImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  apiErrors?: Record<string, string[]>;
}

export function ProductForm({
  product,
  onSave,
  onCancel,
  allCategories: initialAllCategories,
  allColors: initialAllColors,
  setAllColorsInParent, // New prop
  allMakers: initialAllMakers, // New prop
  setAllMakersInParent, // New prop
  allCurrencies,
  allProductTypes,
  isSaving,
  setIsSaving,
  newImageFiles, // New prop
  setNewImageFiles, // New prop
  newImagePreviews, // New prop
  setNewImagePreviews, // New prop
  handleNewImageChange, // New prop
  apiErrors = {},
}: ProductFormProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [allMakers, setAllMakers] = useState(initialAllMakers); // Local state for makers
  const [allCategories, setAllCategories] = useState(initialAllCategories);
  const [allColors, setAllColors] = useState(initialAllColors);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  useEffect(() => {
    setAllCategories(initialAllCategories);
  }, [initialAllCategories]);

  useEffect(() => {
    setAllColors(initialAllColors);
  }, [initialAllColors]);

  useEffect(() => {
    // New useEffect for makers
    setAllMakers(initialAllMakers);
  }, [initialAllMakers]);

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave(editedProduct, newImageFiles);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setEditedProduct(product);
    setNewImageFiles([]); // Clear newImageFiles from parent
    setNewImagePreviews([]); // Clear newImagePreviews from parent
    onCancel();
  };

  const handleRemoveImage = async (imageId: number) => {
    try {
      await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': (
            document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
          )?.content,
        },
      });
      setEditedProduct({
        ...editedProduct,
        images: (editedProduct?.images || []).filter(
          (img) => img.id !== imageId,
        ),
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-start space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative h-32 w-32 flex-shrink-0 md:h-40 md:w-40">
          <ProductImageUpload
            product={editedProduct}
            images={editedProduct.images || []}
            name={editedProduct.name}
            newImageFiles={newImageFiles} // Now passed as prop
            setNewImageFiles={setNewImageFiles} // Now passed as prop
            newImagePreviews={newImagePreviews} // Now passed as prop
            setNewImagePreviews={setNewImagePreviews} // Now passed as prop
            handleNewImageChange={handleNewImageChange} // Now passed as prop
            handleRemoveImage={handleRemoveImage}
          />
        </div>

        <div className="grid w-full flex-grow grid-cols-1 gap-4 md:grid-cols-10">
          <div className="flex flex-col gap-4 md:col-span-3">
            <ProductDetailsForm
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
              allProductTypes={allProductTypes}
              apiErrors={apiErrors} // Pass API errors
            />
          </div>

          <div className="flex flex-col gap-4 md:col-span-3">
            <ProductMakerSelection // New component
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
              allMakers={allMakers}
              setAllMakers={setAllMakers} // Pass local state setter
              setAllMakersInParent={setAllMakersInParent} // Pass parent's setter
            />
            <ProductCategorySelection
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
              allCategories={allCategories}
              setAllCategories={setAllCategories}
            />
            <ProductColorSelection
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
              allColors={allColors}
              setAllColors={setAllColors} // Pass local state setter
              setAllColorsInParent={setAllColorsInParent} // Pass parent's setter
            />
          </div>

          <div className="flex flex-col gap-4 md:col-span-3">
            <ProductPriceInputs
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
              allCurrencies={allCurrencies}
              apiErrors={apiErrors} // Pass API errors
            />
          </div>

          <div className="flex items-end justify-end md:col-span-1">
            <div className="flex w-full flex-col gap-2 sm:flex-row md:flex-col">
              <Button
                onClick={handleSaveClick}
                className="w-full md:aspect-square md:w-auto"
                title="Guardar Cambios"
                disabled={isSaving}
              >
                <Check className="h-4 w-4 md:h-5 md:w-5" />
                <span className="ml-2 md:hidden">Guardar</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancelClick}
                className="w-full md:aspect-square md:w-auto"
                title="Cancelar"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
                <span className="ml-2 md:hidden">Cancelar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
