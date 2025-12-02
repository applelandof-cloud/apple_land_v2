import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { ColorDisplay } from '@/components/ui/ColorDisplay'; // Import ColorDisplay

export interface Inventory {
  id: number;
  product_id: number;
  product_name: string;
  product_image_url?: string;
  batch_id: number;
  batch_entry_date: string;
  batch_expiration_date?: string;
  place_id: number;
  place_name: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: number;
  is_gift: boolean;
  is_visible: boolean;
  color_id: number;
  color: { // Updated to full color object
    id: number;
    name: string;
    hex_code: string;
  };
  status_id: number;
  status_name: string;
  inventory_id: number;
  batch_id: number;
  product_id: number;
  place_id: number;
  product_type_id: number; // Added product_type_id
  device_id: number | null;
  device: {
    id: number;
    imei: string;
    imei2: string;
    serial_number: string;
    storage: string;
  } | null;
  condition_id: number | null;
  condition: {
    id: number;
    name: string;
  } | null;
  accessory: {
    id: number;
    serial_number: string;
    size: string;
    description: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryWithStocks extends Inventory {
  stocks?: Stock[];
  expanded?: boolean;
}

interface InventoryListItemProps {
  inventory: InventoryWithStocks;
  isSelected: boolean;
  onSelect: (inventoryId: number, isSelected: boolean) => void;
  onToggleExpand: (inventoryId: number) => void;
  selectedStockIds: number[];
  onStockSelect?: (stockId: number, isSelected: boolean) => void;
  isSearching?: boolean;
}

export const InventoryListItem: React.FC<InventoryListItemProps> = ({
  inventory,
  isSelected,
  onSelect,
  onToggleExpand,
  selectedStockIds,
  onStockSelect = () => {},
  isSearching,
}) => {
  return (
    <li key={inventory.id} className="border-b border-border bg-card">
      <div className="flex items-center p-4 hover:bg-muted/50 gap-4">
        <Checkbox
          className="mr-4 border-gray-500"
          checked={isSelected}
          onCheckedChange={(checked: boolean) =>
            onSelect(inventory.id, checked)
          }
        />
        {inventory.product_image_url && (
          <img
            src={inventory.product_image_url}
            alt={inventory.product_name}
            className="h-10 w-10 rounded-md object-cover"
          />
        )}

        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 items-center">
            {/* Col 1: Product Name */}
            <div className="col-span-2 md:col-span-1 text-lg font-medium text-foreground min-w-0 truncate">
                {inventory.product_name}
            </div>

            {/* Col 2: Location */}
            <div className="col-span-2 md:col-span-1 text-sm text-muted-foreground min-w-0 truncate">
                Ubicación: {inventory.place_name}
            </div>

            {/* Col 3: Dates */}
            <div className="text-sm text-muted-foreground">
                <p>Entrada: {inventory.batch_entry_date}</p>
                <p>Vencimiento: {inventory.batch_expiration_date || 'N/A'}</p>
            </div>

            {/* Col 4: Quantity */}
            <div className="text-right">
                {!isSearching ? (
                    <span className="text-2xl font-bold text-foreground">
                        {inventory.count}
                    </span>
                ) : (
                    <div className="w-5 h-5" />
                )}
            </div>
        </div>

        {/* Expand Button */}
        <div className="ml-4 flex items-center">
          <button
            onClick={() => onToggleExpand(inventory.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            {inventory.expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {inventory.expanded && (
        <ul className="border-t border-border bg-muted">
          {inventory.stocks ? (
            inventory.stocks.length > 0 ? (
              inventory.stocks.map((stock: Stock) => (
                <li
                  key={stock.id}
                  className="flex items-center border-b border-border p-4 pl-8 last:border-b-0"
                >
                   <Checkbox
                        className="mr-4 border-gray-500"
                        checked={selectedStockIds.includes(stock.id)}
                        onCheckedChange={(checked: boolean) =>
                          onStockSelect(stock.id, checked)
                        }
                      />
                  <div className="grid flex-grow grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {/* Column 1: Device/Accessory Details */}
                    <div>
                      <div className="font-medium text-foreground">Detalles del Producto:</div>
                      {stock.product_type_id === 1 && stock.device ? ( // Dispositivo
                        <>
                          <p className="text-muted-foreground">IMEI: {stock.device.imei}</p>
                          <p className="text-muted-foreground">IMEI2: {stock.device.imei2}</p>
                          <p className="text-muted-foreground">Serie: {stock.device.serial_number}</p>
                          <p className="text-muted-foreground">Almacenamiento: {stock.device.storage}GB</p>
                        </>
                      ) : stock.product_type_id === 2 && stock.accessory ? ( // Accesorio
                        <>
                          <p className="text-muted-foreground">Serie: {stock.accessory.serial_number}</p>
                          <p className="text-muted-foreground">Tamaño: {stock.accessory.size}</p>
                          <p className="text-muted-foreground">Descripción: {stock.accessory.description}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">N/A</p>
                      )}
                    </div>

                    {/* Column 2: Color */}
                    <div>
                      <div className="font-medium text-foreground">Color:</div>
                      {stock.color && <ColorDisplay color={stock.color} />}
                    </div>

                    {/* Column 3: Gift, Visible and Condition */}
                    <div>
                      <div className="font-medium text-foreground">Atributos:</div>
                      <p className="text-muted-foreground">Regalo: {stock.is_gift ? 'Sí' : 'No'}</p>
                      <p className="text-muted-foreground">Visible: {stock.is_visible ? 'Sí' : 'No'}</p>
                      {stock.condition && <p className="text-muted-foreground">Condición: {stock.condition.name}</p>}
                    </div>

                    {/* Column 4: Status */}
                    <div>
                      <div className="font-medium text-foreground">Estado:</div>
                      <p className="text-muted-foreground">{stock.status_name}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 pl-8 text-sm text-muted-foreground">
                No se encontraron existencias para este inventario.
              </li>
            )
          ) : (
            <li className="p-4 pl-8 text-sm text-muted-foreground">
              Cargando existencias...
            </li>
          )}
        </ul>
      )}
    </li>
  );
};
