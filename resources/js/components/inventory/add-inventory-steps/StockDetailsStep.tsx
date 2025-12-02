import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import {
  AddInventoryFormData,
  DeviceModel,
  Product,
  Status,
  StockData,
} from '../types';

interface StockDetailsStepProps {
  formData: AddInventoryFormData;
  handleStockChange: (
    index: number,
    field: keyof StockData,
    value: string | boolean | number,
  ) => void;
  fullSelectedProduct: Product | null;
  statuses: Status[];
  deviceModel: DeviceModel | null;
}

export const StockDetailsStep: React.FC<StockDetailsStepProps> = ({
  formData,
  handleStockChange,
  fullSelectedProduct,
  statuses,
}) => {
  if (!fullSelectedProduct) {
    return <p>Por favor, selecciona un producto primero.</p>;
  }
  return (
    <div className="max-h-[50vh] space-y-2 overflow-y-auto">
      {formData.stocks.map((stock, index) => (
        <div
          key={index}
          className="grid grid-cols-2 items-end gap-2 rounded-md border p-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
        >
          {fullSelectedProduct.product_type_id === 1 && ( // Device
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
              <div>
                <Label htmlFor={`serial_number_${index}`}>
                  Número de Serie
                </Label>
                <Input
                  id={`serial_number_${index}`}
                  value={stock.serial_number}
                  onChange={(e) =>
                    handleStockChange(index, 'serial_number', e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Almacenamiento</Label>
                <Input
                  value={stock.storage}
                  onChange={(e) =>
                    handleStockChange(index, 'storage', e.target.value)
                  }
                />
              </div>
            </>
          )}
          {
            fullSelectedProduct.product_type_id === 2 && ( // Accessory
              <>
                <div>
                  <Label htmlFor={`serial_number_${index}`}>
                    Número de Serie
                  </Label>
                  <Input
                    id={`serial_number_${index}`}
                    value={stock.serial_number}
                    onChange={(e) =>
                      handleStockChange(index, 'serial_number', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`size_${index}`}>
                    Tamaño
                  </Label>
                  <Input
                    id={`size_${index}`}
                    value={stock.size}
                    onChange={(e) =>
                      handleStockChange(index, 'size', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`description_${index}`} className="pt-2">
                    Descripción
                  </Label>
                  <Textarea
                    id={`description_${index}`}
                    value={stock.description}
                    onChange={(e) =>
                      handleStockChange(index, 'description', e.target.value)
                    }
                    className="h-10 resize-none"
                  />
                </div>
              </>
            )
          }

          <div>
            <Label>Color</Label>
            <Select
              onValueChange={(value) =>
                handleStockChange(index, 'color_id', Number(value))
              }
              defaultValue={stock.color_id ? String(stock.color_id) : ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar un color" />
              </SelectTrigger>
              <SelectContent>
                {(fullSelectedProduct.colors || []).length > 0 ? (
                  (fullSelectedProduct.colors || []).map((color) => (
                    <SelectItem key={color.id} value={String(color.id)}>
                      {color.name}
                    </SelectItem>
                  ))
                ) : (
                  <p className="p-4 text-center text-sm">
                    No hay colores disponibles.
                  </p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Estado</Label>
            <Select
              onValueChange={(value) =>
                handleStockChange(index, 'status_id', Number(value))
              }
              defaultValue={String(stock.status_id)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar un estado" />
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

          <div className="flex items-center space-x-2 pb-2">
            <Checkbox
              id={`is_gift_${index}`}
              checked={stock.is_gift}
              onCheckedChange={(checked) =>
                handleStockChange(index, 'is_gift', !!checked)
              }
            />
            <Label htmlFor={`is_gift_${index}`}>Es un Regalo?</Label>
          </div>
        </div>
      ))}
    </div>
  );
};
