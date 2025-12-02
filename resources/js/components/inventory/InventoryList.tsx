import { Spinner } from '@/components/ui/spinner';
import React from 'react';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { Trash2 } from 'lucide-react';
import {
  InventoryListItem,
  type InventoryWithStocks,
} from './InventoryListItem';

interface InventoryListProps {
  inventories: InventoryWithStocks[];
  loading: boolean;
  error: string | null;
  selectedInventoryIds: number[];
  onSelect: (inventoryId: number, isSelected: boolean) => void;
  onToggleExpand: (inventoryId: number) => void;
  renderPagination: () => React.ReactNode;
  selectedStockIds: number[];
  onStockSelect: (stockId: number, isSelected: boolean) => void;
  onDeleteStocks: (stockIds: number[]) => void;
  renderFilterIcons: () => React.ReactNode;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  loading,
  error,
  selectedInventoryIds,
  onSelect,
  onToggleExpand,
  renderPagination,
  selectedStockIds = [],
  onStockSelect,
  onDeleteStocks,
  renderFilterIcons,
}) => {
  const totalStockCount = inventories.reduce((sum, inventory) => {
    return sum + (inventory.stocks ? inventory.stocks.length : 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-180px)] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const handleDelete = () => {
    if (selectedStockIds.length > 0 && onDeleteStocks) {
      onDeleteStocks(selectedStockIds);
    }
  };

  return (
    <>
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <div className="flex items-center p-4 gap-4 border-b bg-card">
          <div className="w-4 h-4 mr-4 shrink-0" />
          <div className="w-10 h-10 shrink-0" />
          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-x-4 items-center">
            <div className="col-span-2 md:col-span-3">
                {renderFilterIcons()}
            </div>
            <div className="col-span-2 md:col-span-1 text-right flex items-baseline justify-end gap-1">
                <span className="text-sm font-medium text-muted-foreground">Total:</span>
                <span className="text-2xl font-bold">{totalStockCount}</span>
            </div>
          </div>
          <div className="ml-4 shrink-0">
              <div className="w-5 h-5" />
          </div>
        </div>
        <ul>
          {inventories.map((inventory) => (
            <InventoryListItem
              key={inventory.id}
              inventory={inventory}
              isSelected={selectedInventoryIds.includes(inventory.id)}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              selectedStockIds={selectedStockIds}
              onStockSelect={onStockSelect}
            />
          ))}
        </ul>
      </div>
      {renderPagination()}

      {selectedStockIds.length > 0 && (
        <FloatingActionButton
          icon={Trash2}
          onClick={handleDelete}
          className="right-8 bottom-48" // Positioned above the edit button
          
        />
      )}
    </>
  );
};
