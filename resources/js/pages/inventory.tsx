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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { inventory } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Boxes, Search, SlidersHorizontal, Pencil, X,Building, CheckCircle, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { InventoryList } from '@/components/inventory/InventoryList';
import { AddInventoryModal } from '@/components/inventory/AddInventoryModal';
import { DeleteStockConfirmationModal } from '@/components/inventory/DeleteStockConfirmationModal';
import {
  InventoryWithStocks,
  Stock,
} from '@/components/inventory/InventoryListItem'; // Import the interface
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface ApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

interface Place {
    id: number;
    name: string;
}

interface Status {
    id: number;
    name: string;
}

interface ProductType {
    id: number;
    name: string;
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<number[]>(
    [],
  );
  const [selectedStockIds, setSelectedStockIds] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stocksForDeletion, setStocksForDeletion] = useState<Stock[]>([]);
  const { toast } = useToast();

  // Advanced search state
  const [places, setPlaces] = useState<Place[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [selectedStatusId, setSelectedStatusId] = useState<string>('');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
    const [appliedFilters, setAppliedFilters] = useState<any>({});


  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [placesRes, statusesRes, productTypesRes] = await Promise.all([
          axios.get('/api/places'),
          axios.get('/api/statuses'),
          axios.get('/api/product-types'),
        ]);
        setPlaces(placesRes.data);
        setStatuses(statusesRes.data);
        setProductTypes(productTypesRes.data);
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      }
    };
    fetchFilterData();
  }, []);

  const handleInventorySelect = (inventoryId: number, isSelected: boolean) => {
    setSelectedInventoryIds((prevSelected) => {
      if (isSelected) {
        return [...prevSelected, inventoryId];
      } else {
        return prevSelected.filter((id) => id !== inventoryId);
      }
    });
  };

  const handleStockSelect = (stockId: number, isSelected: boolean) => {
    setSelectedStockIds((prev) => {
      if (isSelected) {
        return [...prev, stockId];
      } else {
        return prev.filter((id) => id !== stockId);
      }
    });
  };

  const promptDelete = (stockIds: number[]) => {
    const stocksToDelete = inventories
      .flatMap((inv) => inv.stocks || [])
      .filter((stock) => stockIds.includes(stock.id));
    setStocksForDeletion(stocksToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSelectedStocks = async () => {
    setIsDeleteModalOpen(false);
    try {
      const response = await axios.delete('/api/stocks', {
        data: { stock_ids: selectedStockIds },
      });

      toast({
        title: '¡Éxito!',
        description: response.data.message,
      });

      setSelectedStockIds([]);
      fetchInventories(currentPage, debouncedSearchTerm, appliedFilters); // Refresh data
    } catch (err) {
      toast({
        title: 'Error',
        description:
          (err as any).response?.data?.message || 'Failed to delete stocks.',
        variant: 'destructive',
      });
    }
  };

  const fetchInventories = async (page: number = 1, search: string = '', filters: any = {}) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
        page: page.toString(),
        search,
        ...filters
    });

    try {
      const response = await fetch(
        `/api/inventories?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch inventories');
      }
      const data: ApiResponse<InventoryWithStocks> = await response.json();
      setInventories(
        data.data.map((inv) => ({
          ...inv,
          expanded: !!search || Object.keys(filters).length > 0,
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
      const response = await axios.get(
        `/api/stocks?inventory_id=${inventoryId}&search=${debouncedSearchTerm}`,
      );
      const data: ApiResponse<Stock> = response.data;
      setInventories((prevInventories) =>
        prevInventories.map((inv) =>
          inv.id === inventoryId ? { ...inv, stocks: data.data } : inv,
        ),
      );
    } catch (err: unknown) {
      console.error('Error fetching stocks:', err);
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  useEffect(() => {
    fetchInventories(currentPage, debouncedSearchTerm, appliedFilters);
  }, [currentPage, debouncedSearchTerm, appliedFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    const filters: any = {};
    if (selectedPlaceId) filters.place_id = selectedPlaceId;
    if (selectedStatusId) filters.status_id = selectedStatusId;
    if (selectedProductTypeId) filters.product_type_id = selectedProductTypeId;
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    setAppliedFilters(filters);
    setCurrentPage(1);
    setOpenAdvancedSearch(false);
  };

  const handleClearFilter = (filterKey: string) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[filterKey];

    if (filterKey === 'place_id') setSelectedPlaceId('');
    if (filterKey === 'status_id') setSelectedStatusId('');
    if (filterKey === 'product_type_id') setSelectedProductTypeId('');
    if (filterKey === 'start_date') setStartDate('');
    if (filterKey === 'end_date') setEndDate('');


    setAppliedFilters(newFilters);
    setCurrentPage(1);
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

    const renderAppliedFilters = () => {
        const filtersToRender = [];

        if (appliedFilters.place_id) {
            const place = places.find(p => p.id.toString() === appliedFilters.place_id);
            filtersToRender.push({
                key: 'place_id',
                label: 'Lugar',
                value: place?.name,
                icon: Building
            });
        }
        if (appliedFilters.status_id) {
            const status = statuses.find(s => s.id.toString() === appliedFilters.status_id);
            filtersToRender.push({
                key: 'status_id',
                label: 'Estado',
                value: status?.name,
                icon: CheckCircle
            });
        }
        if (appliedFilters.product_type_id) {
            const productType = productTypes.find(pt => pt.id.toString() === appliedFilters.product_type_id);
            filtersToRender.push({
                key: 'product_type_id',
                label: 'Tipo',
                value: productType?.name,
                icon: Package
            });
        }
        if (appliedFilters.start_date && appliedFilters.end_date) {
             filtersToRender.push({
                key: 'date_range',
                label: 'Date Range',
                value: `${appliedFilters.start_date} to ${appliedFilters.end_date}`,
                icon: Package // Replace with a more suitable icon
            });
        }

        return (
            <div className="flex flex-wrap items-center gap-2">
                {filtersToRender.map(filter => (
                    <div key={filter.key} className="flex items-center space-x-1 bg-gray-200 rounded-full px-2 py-1 text-sm">
                        <filter.icon className="h-4 w-4" />
                        <span>{filter.value}</span>
                        <button onClick={() => handleClearFilter(filter.key)}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        );
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
                        <Input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <Input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                      </div>
                    </div>
                     <div className="grid gap-2">
                        <Label>Lugar</Label>
                        <Select value={selectedPlaceId} onValueChange={setSelectedPlaceId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un lugar" />
                            </SelectTrigger>
                            <SelectContent>
                                {places.map(place => (
                                    <SelectItem key={place.id} value={place.id.toString()}>{place.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Estado</Label>
                        <Select value={selectedStatusId} onValueChange={setSelectedStatusId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map(status => (
                                    <SelectItem key={status.id} value={status.id.toString()}>{status.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Tipo de Producto</Label>
                        <Select value={selectedProductTypeId} onValueChange={setSelectedProductTypeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {productTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleApplyFilters}>
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
          selectedStockIds={selectedStockIds}
          onStockSelect={handleStockSelect}
          onDeleteStocks={promptDelete}
          renderFilterIcons={renderAppliedFilters}
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
        onInventoryAdded={() => fetchInventories(currentPage, debouncedSearchTerm, appliedFilters)}
      />
      <DeleteStockConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSelectedStocks}
        stocks={stocksForDeletion}
      />
    </AppLayout>
  );
}
