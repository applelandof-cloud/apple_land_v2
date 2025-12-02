import { cn } from '@/lib/utils';
import { Category, Color, Currency, Maker, Product, ProductType } from '@/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useEffect, useState } from 'react';
import { ProductForm } from './ProductForm';
import { ProductListView } from './ProductListView';
import { ProductTileView } from './ProductTileView';

const productListItemVariants = cva('transition-all duration-300 ease-in-out', {
  variants: {
    viewMode: {
      list: 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800',
      tile: 'flex flex-col rounded-lg border bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg',
      post: 'flex flex-col p-6 border-b bg-white dark:bg-neutral-900',
    },
  },
  defaultVariants: {
    viewMode: 'list',
  },
});

interface ProductListItemProps
  extends VariantProps<typeof productListItemVariants> {
  product: Product | Partial<Product>;
  className?: string;
  onSave: (product: Product | Partial<Product>, newImageFiles: File[]) => void;
  onCancel: () => void;
  isInitiallyEditing?: boolean;
  allCategories: Category[];
  allColors: Color[];
  setAllColorsInParent: (colors: Color[]) => void; // New prop
  allMakers: Maker[]; // New prop
  setAllMakersInParent: (makers: Maker[]) => void; // New prop
  allCurrencies: Currency[];
  allProductTypes: ProductType[];
  onSelect?: (productId: number, isSelected: boolean) => void;
  isSelected?: boolean;
  newImageFiles: File[];
  setNewImageFiles: (files: File[]) => void;
  newImagePreviews: string[];
  setNewImagePreviews: (previews: string[]) => void;
  handleNewImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductListItem = forwardRef<HTMLDivElement, ProductListItemProps>(({ // Wrap with forwardRef
  product,
  viewMode,
  className,
  onSave,
  onCancel,
  isInitiallyEditing = false,
  allCategories,
  allColors,
  setAllColorsInParent, // New prop
  allMakers, // New prop
  setAllMakersInParent, // New prop
  allCurrencies,
  allProductTypes,
  onSelect,
  isSelected,
  newImageFiles,        // New prop
  setNewImageFiles,     // New prop
  newImagePreviews,     // New prop
  setNewImagePreviews,  // New prop
  handleNewImageChange, // New prop
}:ProductListItemProps, ref) => { // Accept ref as second arg
  const [isEditing, setIsEditing] = useState(isInitiallyEditing);
  const [isSaving, setIsSaving] = useState(false);

  // Sync isEditing with isInitiallyEditing prop
  useEffect(() => {
    setIsEditing(isInitiallyEditing);
  }, [isInitiallyEditing]);

  const handleSave = (productToSave: Product | Partial<Product>, files: File[]) => { // Modified signature
    onSave(productToSave, files); // Pass files up
    if ('id' in productToSave) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    onCancel();
  };

  if (isEditing) {
    return (
      <div
        ref={ref} // Attach ref here
        className={cn(
          productListItemVariants({ viewMode: 'list' }),
          className,
          'flex flex-col items-start md:flex-row',
        )}
      >
        <ProductForm
          product={product}
          onSave={handleSave}
          onCancel={handleCancel}
          allCategories={allCategories}
          allColors={allColors}
          setAllColorsInParent={setAllColorsInParent} // Pass new prop
          allMakers={allMakers} // Pass new prop
          setAllMakersInParent={setAllMakersInParent} // Pass new prop
          allCurrencies={allCurrencies}
          allProductTypes={allProductTypes}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          newImageFiles={newImageFiles}         // New prop
          setNewImageFiles={setNewImageFiles}   // New prop
          newImagePreviews={newImagePreviews}   // New prop
          setNewImagePreviews={setNewImagePreviews} // New prop
          handleNewImageChange={handleNewImageChange} // New prop
        />
      </div>
    );
  }

  if (viewMode === 'tile') {
    return (
      <ProductTileView
        product={product as Product}
        className={className}
        onSelect={onSelect}
        isSelected={isSelected}
      />
    );
  }

  // list view is the default
  return (
    <ProductListView
      product={product as Product}
      className={className}
      onSelect={onSelect}
      isSelected={isSelected}
      onEdit={() => setIsEditing(true)}
    />
  );
}
)