import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { inventory } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Boxes, Search, SlidersHorizontal, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { InventoryList } from '@/components/inventory/InventoryList';
import {
  InventoryWithStocks,
  Stock,
} from '@/components/inventory/InventoryListItem'; // Import the interface
import { AddInventoryModal } from '@/components/inventory/AddInventoryModal';

interface ApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    // Add other meta properties if needed
  };
  // Add other top-level API response properties if needed
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inventario',
    href: inventory().url,
    icon: Boxes,
  },
];

export default function Inventory() {
  const [inventories, setInventories] = useState<InventoryWithStocks[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<number[]>(
    [],
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleInventorySelect = (inventoryId: number, isSelected: boolean) => {
    setSelectedInventoryIds((prevSelected) => {
      if (isSelected) {
        return [...prevSelected, inventoryId];
      } else {
        return prevSelected.filter((id) => id !== inventoryId);
      }
    });
  };

  const fetchInventories = async (page: number = 1, search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/inventories?page=${page}&search=${search}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch inventories');
      }
      const data: ApiResponse<InventoryWithStocks> = await response.json(); // Type the response
      setInventories(
        data.data.map((inv) => ({ // inv is now correctly typed
          ...inv,
          expanded: !!search, // Expand if search term is present
        })),
      );
      setCurrentPage(data.meta.current_page);
      setTotalPages(data.meta.last_page);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async (inventoryId: number) => {
    try {
      const response = await fetch(
        `/api/inventories/${inventoryId}/stocks?search=${searchTerm}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch stocks');
      }
      const data: ApiResponse<Stock> = await response.json(); // Type the response
      setInventories((prevInventories) =>
        prevInventories.map((inv) =>
          inv.id === inventoryId ? { ...inv, stocks: data.data } : inv,
        ),
      );
    } catch (err: unknown) { // More specific error type
      console.error('Error fetching stocks:', err);
      setError((err as Error).message); // Set error state
    }
  };

  useEffect(() => {
    fetchInventories(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const toggleExpand = (inventoryId: number) => {
    setInventories((prevInventories) =>
      prevInventories.map((inv) =>
        inv.id === inventoryId ? { ...inv, expanded: !inv.expanded } : inv,
      ),
    );
    const inventory = inventories.find((inv) => inv.id === inventoryId);
    if (inventory && !inventory.expanded && !inventory.stocks) {
      fetchStocks(inventoryId);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 rounded px-3 py-1 ${
            currentPage === i ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
        >
          {i}
        </button>,
      );
    }
    return <div className="mt-4 flex justify-center">{pages}</div>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs} title="Inventario">
      <Head title="Inventario" />
      <div className="p-4 md:p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="hidden text-2xl font-bold sm:block">Inventario</h1>
          <div className="mt-4 flex w-full items-center space-x-1 sm:mt-0 sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by product name, IMEI, or serial number..."
                className="w-full rounded-md border py-2 pr-4 pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Popover
              open={openAdvancedSearch}
              onOpenChange={setOpenAdvancedSearch}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-9 w-9 cursor-pointer"
                >
                  <SlidersHorizontal className="size-5! opacity-80 group-hover:opacity-100" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full max-w-md"
                align="end"
                side="bottom"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Búsqueda Avanzada
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Refina tu búsqueda con las opciones a continuación.
                    </p>
                  </div>
                  <div className="grid gap-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date-range">Rango de Fechas</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="date" id="start-date" />
                        <Input type="date" id="end-date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Otras Opciones</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="option1" />
                          <Label htmlFor="option1">Opción 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="option2" />
                          <Label htmlFor="option2">Opción 2</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setOpenAdvancedSearch(false)}>
                      Buscar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <InventoryList
          inventories={inventories}
          loading={loading}
          error={error}
          selectedInventoryIds={selectedInventoryIds}
          onSelect={handleInventorySelect}
          onToggleExpand={toggleExpand}
          renderPagination={renderPagination}
        />

        <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
        {selectedInventoryIds.length === 1 && (
          <FloatingActionButton
            icon={Pencil}
            onClick={() =>
              console.log('Edit Inventory:', selectedInventoryIds[0])
            }
            className="right-8 bottom-28"
          />
        )}
      </div>
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onInventoryAdded={() => fetchInventories(currentPage, searchTerm)}
      />
    </AppLayout>
  );
}
