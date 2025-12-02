import React from 'react';
import { Label } from '@/components/ui/label';
import { ProductAutocomplete } from '../ProductAutocomplete';
import { Product } from '../types';

interface ProductStepProps {
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
}

export const ProductStep: React.FC<ProductStepProps> = ({
  selectedProduct,
  onProductSelect,
}) => {
  return (
    <div>
      <Label htmlFor="product">Producto</Label>
      <ProductAutocomplete
        selectedProduct={selectedProduct}
        onProductSelect={onProductSelect}
      />
    </div>
  );
};
