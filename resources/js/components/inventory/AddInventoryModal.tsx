import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast'; // Assuming useToast is available

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInventoryAdded: () => void;
}

interface Color {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  product_type_id: number;
  colors: Color[];
}

interface Place {
  id: number;
  name: string;
}

interface DeviceModel {
  storage: string;
}

interface StockData {
  color_id: number;
  is_gift: boolean;
  status_id: number;
  imei: string;
  imei2: string;
  serial_number: string;
  storage: string;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onInventoryAdded,
}) => {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [deviceModel, setDeviceModel] = useState<DeviceModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast(); // Initialize useToast

  const [formData, setFormData] = useState<{
    product_id: string;
    entry_date: string;
    expiration_date: string;
    place_id: string;
    count: number;
    stocks: Partial<StockData>[];
  }>({
    product_id: '',
    entry_date: '',
    expiration_date: '',
    place_id: '',
    count: 0,
    stocks: [],
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setStep(1);
      setFormData({
        product_id: '',
        entry_date: '',
        expiration_date: '',
        place_id: '',
        count: 0,
        stocks: [],
      });
      setDeviceModel(null);

      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data));

      fetch('/api/places')
        .then((res) => res.json())
        .then((data) => setPlaces(data));

      fetch('/api/statuses')
        .then((res) => res.json())
        .then((data) => setStatuses(data));
    }
  }, [isOpen]);

  useEffect(() => {
    const product = products.find(
      (p) => p.id === Number(formData.product_id),
    );
    if (product && product.product_type_id === 1) {
      // Device
      fetch(`/api/products/${formData.product_id}/devicemodel`)
        .then((res) => res.json())
        .then((data) => setDeviceModel(data));
    }
  }, [formData.product_id, products]);

  const handleCountChange = (count: number) => {
    const newStocks: Partial<StockData>[] = [];
    const selectedProduct = products.find(
      (p) => p.id === Number(formData.product_id),
    );
    for (let i = 0; i < count; i++) {
      newStocks.push({
        color_id: selectedProduct?.colors[0]?.id || 1,
        is_gift: false,
        status_id: 1,
        imei: '',
        imei2: '',
        serial_number: '',
        storage: deviceModel?.storage || '',
      });
    }
    setFormData({ ...formData, count, stocks: newStocks });
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
      const response = await fetch('/api/inventories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add inventory');
      }

      toast({
        title: 'Success!',
        description: 'Inventory added successfully.',
      });
      onInventoryAdded(); // Refresh the list
      onClose(); // Close the modal
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
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

  const selectedProduct = products.find(
    (p) => p.id === Number(formData.product_id),
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Label htmlFor="product">Product</Label>
            <Select
              onValueChange={(value) => {
                setDeviceModel(null);
                setFormData({
                  ...formData,
                  product_id: value,
                  count: 0,
                  stocks: [],
                });
              }}
              defaultValue={formData.product_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entry_date">Entry Date</Label>
              <Input
                id="entry_date"
                type="date"
                value={formData.entry_date}
                onChange={(e) =>
                  setFormData({ ...formData, entry_date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={(e) =>
                  setFormData({ ...formData, expiration_date: e.target.value })
                }
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <Label htmlFor="place">Place</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, place_id: value })
              }
              defaultValue={formData.place_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a place" />
              </SelectTrigger>
              <SelectContent>
                {places.map((place) => (
                  <SelectItem key={place.id} value={String(place.id)}>
                    {place.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 4:
        return (
          <div>
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              value={formData.count}
              onChange={(e) => handleCountChange(Number(e.target.value))}
              className="text-2xl p-4"
            />
          </div>
        );
      case 5:
        if (!selectedProduct) {
          return <p>Please select a product first.</p>;
        }
        return (
          <div className="space-y-2 overflow-y-auto">
            {formData.stocks.map((stock, index) => (
              <div key={index} className="p-2 border rounded-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-end">
                {selectedProduct.product_type_id === 1 && ( // Device
                  <>
                    <div>
                      <Label htmlFor={`imei_${index}`}>IMEI</Label>
                      <Input
                        id={`imei_${index}`}
                        value={stock.imei}
                        onChange={(e) =>
                          handleStockChange(index, 'imei', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`imei2_${index}`}>IMEI2</Label>
                      <Input
                        id={`imei2_${index}`}
                        value={stock.imei2}
                        onChange={(e) =>
                          handleStockChange(index, 'imei2', e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label>Color</Label>
                  <Select
                    onValueChange={(value) => handleStockChange(index, 'color_id', Number(value))}
                    defaultValue={String(stock.color_id)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.colors.map((color) => (
                        <SelectItem key={color.id} value={String(color.id)}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    onValueChange={(value) => handleStockChange(index, 'status_id', Number(value))}
                    defaultValue={String(stock.status_id)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={String(status.id)}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Storage</Label>
                  <Input
                    value={stock.storage}
                    onChange={(e) =>
                      handleStockChange(index, 'storage', e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center space-x-2 pb-2">
                  <Checkbox
                    id={`is_gift_${index}`}
                    checked={stock.is_gift}
                    onCheckedChange={(checked) =>
                      handleStockChange(index, 'is_gift', !!checked)
                    }
                  />
                  <Label htmlFor={`is_gift_${index}`}>Is Gift?</Label>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen">
        <DialogHeader>
          <DialogTitle>Add New Inventory</DialogTitle>
          <DialogDescription>Step {step} of 5</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2 overflow-y-auto">
            {renderStep()}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          {step > 1 && (
            <Button onClick={handleBack} variant="outline" disabled={isSubmitting}>
              Back
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={handleNext} disabled={isSubmitting}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


