import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Product,
  Place,
  Status,
  DeviceModel,
  StockData,
  AddInventoryFormData,
} from './types';
import { ProductStep } from './add-inventory-steps/ProductStep';
import { DatesStep } from './add-inventory-steps/DatesStep';
import { LocationStep } from './add-inventory-steps/LocationStep';
import { QuantityStep } from './add-inventory-steps/QuantityStep';
import { StockDetailsStep } from './add-inventory-steps/StockDetailsStep';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInventoryAdded: () => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onInventoryAdded,
}) => {
  const [step, setStep] = useState(1);
  const [places, setPlaces] = useState<Place[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fullSelectedProduct, setFullSelectedProduct] =
    useState<Product | null>(null);
  const [deviceModel, setDeviceModel] = useState<DeviceModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast(); // Initialize useToast

  const [formData, setFormData] = useState<AddInventoryFormData>({
    product_id: '',
    entry_date: '',
    expiration_date: '',
    place_id: '',
    count: '0',
    stocks: [],
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setStep(1);

      const today = new Date();
      const entryDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

      const expiration = new Date();
      expiration.setMonth(expiration.getMonth() + 3);
      const expirationDate = expiration.toISOString().split('T')[0]; // YYYY-MM-DD

      setFormData({
        product_id: '',
        entry_date: entryDate,
        expiration_date: expirationDate,
        place_id: '',
        count: '0',
        stocks: [],
      });
      setSelectedProduct(null);
      setDeviceModel(null);

      fetch('/api/places')
        .then((res) => res.json())
        .then((data) => setPlaces(data));

      fetch('/api/statuses')
        .then((res) => res.json())
        .then((data) => setStatuses(data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (fullSelectedProduct && fullSelectedProduct.product_type_id === 1) {
      // Device
      fetch(`/api/products/${fullSelectedProduct.id}/devicemodel`)
        .then((res) => res.json())
        .then((data) => setDeviceModel(data));
    } else {
      setDeviceModel(null);
    }
  }, [fullSelectedProduct]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product_id: selectedProduct?.id.toString() || '',
    }));
  }, [selectedProduct]);

    const [isProductDetailsLoading, setIsProductDetailsLoading] =
    useState(false);

  useEffect(() => {
    if (selectedProduct && fullSelectedProduct?.id !== selectedProduct.id) {
      setIsProductDetailsLoading(true);
      fetch(`/api/products/${selectedProduct.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.colors !== undefined) {
            // Check if colors property exists
            setFullSelectedProduct(data);
          } else {
            console.warn(
              'Fetched product details do not include colors or colors is undefined:',
              data,
            );
            setFullSelectedProduct((prev) =>
              prev ? { ...prev, colors: [] } : null,
            ); // Ensure colors is an array if missing
          }
        })
        .catch((error) => {
          console.error('Failed to fetch full product details:', error);
          setFullSelectedProduct(null);
        })
        .finally(() => {
          setIsProductDetailsLoading(false);
        });
    } else if (!selectedProduct) {
      // If selectedProduct becomes null, clear fullSelectedProduct
      setFullSelectedProduct(null);
    }
  }, [selectedProduct, fullSelectedProduct?.id]);

  useEffect(() => {
    if (places.length > 0 && formData.place_id === '') {
      setFormData((prev) => ({
        ...prev,
        place_id: String(places[0].id),
      }));
    }
  }, [places, formData.place_id]);

  const handleCountChange = (countValue: string) => {
    // Guard against race condition where product details haven't loaded yet
    if (!fullSelectedProduct) {
      return;
    }

    if (countValue === '') {
      setFormData({ ...formData, count: '', stocks: [] });
      return;
    }

    // Allow only numbers
    if (!/^\d+$/.test(countValue)) {
      return;
    }

    const count = parseInt(countValue, 10);
    const newStocks: Partial<StockData>[] = [];
    for (let i = 0; i < count; i++) {
      newStocks.push({
        color_id:
          fullSelectedProduct.colors?.length > 0
            ? fullSelectedProduct.colors[0].id
            : undefined,
        is_gift: false,
        status_id: 1,
        imei: '',
        imei2: '',
        serial_number: '',
        storage: deviceModel?.storage || '',
      });
    }
    setFormData({ ...formData, count: String(count), stocks: newStocks });
  };

  const handleStockChange = (
    index: number,
    field: keyof StockData,
    value: string | boolean | number,
  ) => {
    const newStocks = [...formData.stocks];
    newStocks[index] = { ...newStocks[index], [field]: value };
    setFormData({ ...formData, stocks: newStocks });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        stocks: formData.stocks.map((stock) => ({
          ...stock,
          storage: stock.storage,
        })),
      };
      const response = await fetch('/api/inventories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fallo al agregar inventario');
      }

      toast({
        title: '¡Éxito!',
        description: 'Inventario añadido correctamente.',
      });
      onInventoryAdded(); // Refresh the list
      onClose(); // Close the modal
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        errorMessage = (error as { message: string }).message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSelect = useCallback((product: Product | null) => {
    setSelectedProduct(product);
    if (product) {
      setFormData((prev) => ({
        ...prev,
        product_id: product.id.toString(),
        count: '0',
        stocks: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        product_id: '',
        count: '0',
        stocks: [],
      }));
    }
  }, []); // Removed setSelectedProduct and setFormData from dependencies

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProductStep
            selectedProduct={selectedProduct}
            onProductSelect={handleProductSelect}
          />
        );
      case 2:
        return <DatesStep formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
            places={places}
          />
        );
      case 4:
        return (
          <QuantityStep
            count={formData.count}
            handleCountChange={handleCountChange}
            disabled={isProductDetailsLoading}
          />
        );
      case 5:
        return (
          <StockDetailsStep
            formData={formData}
            handleStockChange={handleStockChange}
            fullSelectedProduct={fullSelectedProduct}
            statuses={statuses}
            deviceModel={deviceModel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onPointerDownOutside={(event) => {
          const popover = document.querySelector(
            '[data-radix-popover-content-wrapper]',
          );
          if (popover && popover.contains(event.target as Node)) {
            event.preventDefault();
          }
        }}
        className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      >
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Inventario</DialogTitle>
          <DialogDescription>Paso {step} de 5</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2 overflow-y-auto">{renderStep()}</div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={isSubmitting}
            >
              Atrás
            </Button>
          )}
          {step < 5 ? (
            <Button
              onClick={handleNext}
              disabled={isSubmitting || (step === 1 && !formData.product_id)}
            >
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


