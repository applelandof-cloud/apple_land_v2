import { Spinner } from '@/components/ui/spinner';
import React from 'react';
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
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventories,
  loading,
  error,
  selectedInventoryIds,
  onSelect,
  onToggleExpand,
  renderPagination,
}) => {
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

  return (
    <>
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul>
          {inventories.map((inventory) => (
            <InventoryListItem
              key={inventory.id}
              inventory={inventory}
              isSelected={selectedInventoryIds.includes(inventory.id)}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </ul>
      </div>
      {renderPagination()}
    </>
  );
};
