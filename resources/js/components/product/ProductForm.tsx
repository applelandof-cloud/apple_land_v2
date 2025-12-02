import { Button } from '@/components/ui/button';
import { ValidationModal } from '@/components/ValidationModal';
import { Category, Color, Currency, Product, ProductType } from '@/types';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductColorSelection } from './ProductColorSelection';
import { ProductCategorySelection } from './ProductCategorySelection';
import { ProductDetailsForm } from './ProductDetailsForm';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductPriceInputs } from './ProductPriceInputs';

interface ProductFormProps {
  product: Product | Partial<Product>;
  onSave: (product: Product | Partial<Product>) => void;
  onCancel: () => void;
  allCategories: Category[],
  allColors: Color[];
  allCurrencies: Currency[];
  allProductTypes: ProductType[];
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
}

export function ProductForm({
  product,
  onSave,
  onCancel,
  allCategories: initialAllCategories,
  allColors: initialAllColors,
  allCurrencies,
  allProductTypes,
  isSaving,
  setIsSaving,
}: ProductFormProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
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

  useEffect(() => {
    // Cleanup object URLs
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [newImagePreviews]);

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
      let productToSave = { ...editedProduct };

      if ('id' in product && newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map((file) => {
          const formData = new FormData();
          formData.append('image', file);
          return fetch(`/api/products/${product.id}/images`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': (
                document.querySelector(
                  'meta[name="csrf-token"]',
                ) as HTMLMetaElement
              )?.content,
            },
            body: formData,
          }).then((res) => res.json());
        });

        try {
          const uploadedImages = await Promise.all(uploadPromises);
          productToSave = {
            ...productToSave,
            images: [...(productToSave.images || []), ...uploadedImages],
          };
        } catch (error) {
          console.error('Failed to upload images:', error);
          return;
        }
      }

      onSave(productToSave);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setEditedProduct(product);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    onCancel();
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewImagePreviews(previews);
    }
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
            // newImageFiles={newImageFiles}
            newImagePreviews={newImagePreviews}
            handleNewImageChange={handleNewImageChange}
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
            setAllColors={setAllColors}
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
