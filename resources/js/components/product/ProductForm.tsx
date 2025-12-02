import { Button } from '@/components/ui/button';
import { ValidationModal } from '@/components/ValidationModal';
import { Category, Color, Currency, Maker, Product, ProductType } from '@/types';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductColorSelection } from './ProductColorSelection';
import { ProductCategorySelection } from './ProductCategorySelection';
import { ProductDetailsForm } from './ProductDetailsForm';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductMakerSelection } from './ProductMakerSelection'; // New import
import { ProductPriceInputs } from './ProductPriceInputs';

interface ProductFormProps {
  product: Product | Partial<Product>;
  onSave: (product: Product | Partial<Product>, newImageFiles: File[]) => void;
  onCancel: () => void;
  allMakers: Maker[]; // List of all makers from parent
  setAllMakersInParent: (makers: Maker[]) => void; // Parent's setter for all makers
  allCategories: Category[],
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
  newImageFiles,       // New prop
  setNewImageFiles,     // New prop
  newImagePreviews,     // New prop
  setNewImagePreviews,  // New prop
  handleNewImageChange, // New prop
}: ProductFormProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  // const [allColors, setAllColors] = useState(initialAllColors); // Local state for colors
  const [allMakers, setAllMakers] = useState(initialAllMakers); // Local state for makers
  // const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  // const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState(initialAllCategories);
  const [allColors, setAllColors] = useState(initialAllColors);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Sync state with prop changes
  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  useEffect(() => {
    setAllCategories(initialAllCategories);
  }, [initialAllCategories]);

  useEffect(() => {
    setAllColors(initialAllColors);
  }, [initialAllColors]);

  useEffect(() => { // New useEffect for makers
    setAllMakers(initialAllMakers);
  }, [initialAllMakers]);

  const handleValidationModalClose = () => {
    setIsValidationModalOpen(false);
    setValidationMessage('');
  };

  const handleSaveClick = async () => {
    if (!editedProduct.name || editedProduct.name.trim() === '') {
      setValidationMessage('El nombre del producto es obligatorio.');
      setIsValidationModalOpen(true);
      return;
    }

    const hasValidPrice =
      editedProduct.prices &&
      editedProduct.prices.some((price) => price.value > 0);
    if (!hasValidPrice) {
      setValidationMessage(
        'Debe ingresar al menos un precio válido (mayor que 0).',
      );
      setIsValidationModalOpen(true);
      return;
    }

    if (
      editedProduct.product_type_id === 1 &&
      (!editedProduct.device_model ||
        !editedProduct.device_model.model_number ||
        editedProduct.device_model.model_number.trim() === '')
    ) {
      setValidationMessage(
        'El número de modelo del dispositivo es obligatorio.',
      );
      setIsValidationModalOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      // Call onSave with the product data and new image files
      await onSave(editedProduct, newImageFiles);
      // Parent component will handle clearing newImageFiles and newImagePreviews
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
        images: (editedProduct.images || []).filter(
          (img) => img.id !== imageId,
        ),
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <>
      <ValidationModal
        open={isValidationModalOpen}
        onClose={handleValidationModalClose}
        message={validationMessage}
      />
      <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <ProductImageUpload
            product={product}
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

        <div className="flex flex-col gap-4 lg:col-span-4">
          <ProductDetailsForm
            editedProduct={editedProduct}
            setEditedProduct={setEditedProduct}
            allProductTypes={allProductTypes}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
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
          <ProductPriceInputs
            editedProduct={editedProduct}
            setEditedProduct={setEditedProduct}
            allCurrencies={allCurrencies}
          />
        </div>

        <div className="flex flex-col justify-end gap-2 sm:flex-row lg:col-span-1 lg:flex-col">
          <Button
            onClick={handleSaveClick}
            className="w-full lg:aspect-square lg:w-auto"
            title="Guardar Cambios"
            disabled={isSaving}
          >
            <Check className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="ml-2 lg:hidden">Guardar</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleCancelClick}
            className="w-full lg:aspect-square lg:w-auto"
            title="Cancelar"
          >
            <X className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="ml-2 lg:hidden">Cancelar</span>
          </Button>
        </div>
      </div>
    </>
  );
}
