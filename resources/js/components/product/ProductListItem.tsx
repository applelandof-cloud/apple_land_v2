import { cn } from '@/lib/utils';
import { Category, Color, Currency, Product, ProductType } from '@/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { useEffect, useState } from 'react';
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
  onSave: (product: Product | Partial<Product>) => void;
  onCancel: () => void;
  isInitiallyEditing?: boolean;
  allCategories: Category[];
  allColors: Color[];
  allCurrencies: Currency[];
  allProductTypes: ProductType[];
  onSelect?: (productId: number, isSelected: boolean) => void;
  isSelected?: boolean;
}

export function ProductListItem({
  product,
  viewMode,
  className,
  onSave,
  onCancel,
  isInitiallyEditing = false,
  allCategories,
  allColors,
  allCurrencies,
  allProductTypes,
  onSelect,
  isSelected,
}: ProductListItemProps) {
  const [isEditing, setIsEditing] = useState(isInitiallyEditing);
  const [isSaving, setIsSaving] = useState(false);

  // Sync isEditing with isInitiallyEditing prop
  useEffect(() => {
    setIsEditing(isInitiallyEditing);
  }, [isInitiallyEditing]);

  const handleSave = (productToSave: Product | Partial<Product>) => {
    onSave(productToSave);
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
          allCurrencies={allCurrencies}
          allProductTypes={allProductTypes}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
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
