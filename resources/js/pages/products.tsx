import { ProductListItem } from '@/components/product/ProductListItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { FloatingDeleteButton } from '@/components/ui/floating-delete-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Layout from '@/layouts/app-layout';
import {
  Category,
  Color,
  Currency,
  Maker,
  PriceProduct,
  PriceType,
  Product,
  ProductType,
} from '@/types';
import * as AlertDialog from '@radix-ui/react-dialog';
import { Columns, List, Rows, Search, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ViewMode = 'list' | 'tile' | 'post';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [allMakers, setAllMakers] = useState<Maker[]>([]); // New state for makers
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [productToAdd, setProductToAdd] = useState<Partial<Product> | null>(null); // New state
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // New state
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]); // New state
  const [isAnimatingNewForm, setIsAnimatingNewForm] = useState(false); // New state for animation

  // New handler for image file changes
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewImagePreviews(previews);
    }
  };

  // Effect to clean up object URLs
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [newImagePreviews]);

  const newProductFormRef = useRef<HTMLDivElement>(null); // New ref for scrolling

  // Effect to scroll to the new product form and trigger animation when it appears
  useEffect(() => {
    if (isAdding && newProductFormRef.current) {
      // Use setTimeout to ensure the DOM has rendered the new item before scrolling
      const scrollTimer = setTimeout(() => {
        newProductFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0); // Defer to next tick

      setIsAnimatingNewForm(true); // Trigger animation
      const animationTimer = setTimeout(() => {
        setIsAnimatingNewForm(false); // Stop animation after a delay
      }, 1000); // Animation duration is 1s, so stop after 1s
      
      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(animationTimer);
      };
    }
  }, [isAdding]);

  // Function to create a fresh product template - replaces useMemo
  const createFreshProductTemplate = useCallback((): Partial<Product> => {
    const prices: PriceProduct[] = priceTypes.map((pt) => {
      const defaultCurrency =
        currencies.length > 0
          ? currencies[0]
          : { id: 1, name: 'USD', symbol: '$' };
      return {
        price_type_id: pt.id,
        value: 0,
        currency_id: defaultCurrency.id,
        price_type: pt,
        currency: defaultCurrency,
      };
    });

    return {
      name: '',
      product_type_id: 1,
      maker_id: null, // New field, initialized to null
      device_model: {
        storage: '',
        ram: '',
        model_number: '',
        sku: '',
        sim: '',
      },
      tech_accessory: { model_number: '', size: '', description: '' },
      prices: prices,
      colors: [],
      images: [],
    };
  }, [priceTypes, currencies]);

  // Effect to reset productToAdd when isAdding becomes true
  useEffect(() => {
    if (isAdding) {
      setProductToAdd(createFreshProductTemplate());
    } else {
      setProductToAdd(null); // Clear when not adding
    }
  }, [isAdding, createFreshProductTemplate]);

  const handleProductSelect = (productId: number, isSelected: boolean) => {
    setSelectedProductIds((prevSelected) => {
      if (isSelected) {
        return [...prevSelected, productId];
      } else {
        return prevSelected.filter((id) => id !== productId);
      }
    });
  };

  // Effect for fetching static data like colors, currencies, etc.
  useEffect(() => {
    async function fetchStaticData() {
      try {
        const [
          colorsResponse,
          currenciesResponse,
          productTypesResponse,
          priceTypesResponse,
          makersResponse, // New fetch for makers
          categoriesResponse,
        ] = await Promise.all([
          fetch('/api/colors'),
          fetch('/api/currencies'),
          fetch('/api/product-types'),
          fetch('/api/price-types'),
          fetch('/api/makers'), // New fetch for makers
          fetch('/api/categories'),
        ]);
        const colorsData = await colorsResponse.json();
        const currenciesData = await currenciesResponse.json();
        const productTypesData = await productTypesResponse.json();
        const priceTypesData = await priceTypesResponse.json();
        const makersData = await makersResponse.json(); // New data for makers
        const categoriesData = await categoriesResponse.json();
        setColors(colorsData);
        setCurrencies(currenciesData);
        setProductTypes(productTypesData);
        setPriceTypes(priceTypesData);
        setAllMakers(makersData); // Set makers state
        setAllCategories(categoriesData.categories);
      } catch (error) {
        console.error('Error fetching static data:', error);
      }
    }

    fetchStaticData();
  }, []);

  // Effect for fetching products with debouncing on the search term
  useEffect(() => {
    setLoading(true);
    const debounceTimer = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/products?search=${searchTerm}`);
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleUpdateProduct = async (
    productToUpdate: Product | Partial<Product>,
    filesToUpload: File[], // New parameter
  ) => {
    if (!('id' in productToUpdate)) {
      console.error('Cannot update a product without an ID.');
      return;
    }
    try {
      // 1. Upload images if any
      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map((file) => {
          const formData = new FormData();
          formData.append('image', file);
          return fetch(`/api/products/${productToUpdate.id}/images`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN':
                document
                  .querySelector('meta[name="csrf-token"]')
                  ?.getAttribute('content') || '',
            },
            body: formData,
          });
        });
        await Promise.all(uploadPromises);
      }

      // 2. Update the product data
      const updateResponse = await fetch(
        `/api/products/${productToUpdate.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN':
              document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '',
          },
          body: JSON.stringify(productToUpdate),
        },
      );
      const updatedProduct = await updateResponse.json();

      // 3. Update the product list with the final product (might include new images)
      const finalProductResponse = await fetch(
        `/api/products/${updatedProduct.id}`,
      );
      const finalProduct = await finalProductResponse.json();

      setProducts(
        products.map((p) => (p.id === finalProduct.id ? finalProduct : p)),
      );
      setNewImageFiles([]); // Clear image state
      setNewImagePreviews([]); // Clear image state
    } catch (error) {
      console.error('Error updating product:', error);
      // Optionally handle error cleanup:
      setNewImageFiles([]);
      setNewImagePreviews([]);
    }
  };

  const handleCreateProduct = async (
    newProduct: Partial<Product>,
    filesToUpload: File[], // New parameter
  ) => {
    try {
      // 1. Create the product
      const createResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: JSON.stringify(newProduct),
      });
      const createdProduct = await createResponse.json(); // Product with ID

      // 2. Upload images if any
      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map((file) => {
          const formData = new FormData();
          formData.append('image', file);
          return fetch(`/api/products/${createdProduct.id}/images`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN':
                document
                  .querySelector('meta[name="csrf-token"]')
                  ?.getAttribute('content') || '',
            },
            body: formData,
          });
        });
        await Promise.all(uploadPromises);
      }

      // 3. Fetch the complete product to get image URLs (if uploaded) and update state
      const finalProductResponse = await fetch(
        `/api/products/${createdProduct.id}`,
      );
      const finalProduct = await finalProductResponse.json();

      setProducts([finalProduct, ...products]);
      setIsAdding(false);
      setNewImageFiles([]); // Clear image state
      setNewImagePreviews([]); // Clear image state
    } catch (error) {
      console.error('Error creating product:', error);
      // Optionally handle error cleanup:
      setNewImageFiles([]);
      setNewImagePreviews([]);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    if (selectedProductIds.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const executeDelete = async () => {
    try {
      const response = await fetch('/api/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':
            document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
        },
        body: JSON.stringify({ ids: selectedProductIds }),
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter(
            (p) => !selectedProductIds.includes(p.id as number),
          ),
        );
        setSelectedProductIds([]);
      } else {
        console.error('Failed to delete products');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const selectedProductNames = useMemo(() => {
    return products
      .filter((p) => selectedProductIds.includes(p.id as number))
      .map((p) => p.name);
  }, [products, selectedProductIds]);

  // const newProductTemplate = useMemo((): Partial<Product> => {
  //   const prices: PriceProduct[] = priceTypes.map((pt) => {
  //     const defaultCurrency =
  //       currencies.length > 0
  //         ? currencies[0]
  //         : { id: 1, name: 'USD', symbol: '$' };
  //     return {
  //       price_type_id: pt.id,
  //       value: 0,
  //       currency_id: defaultCurrency.id,
  //       price_type: pt,
  //       currency: defaultCurrency,
  //     };
  //   });

  //   return {
  //     name: '',
  //     product_type_id: 1,
  //     device_model: {
  //       storage: '',
  //       ram: '',
  //       model_number: '',
  //       sku: '',
  //       sim: '',
  //     },
  //     tech_accessory: { model_number: '', size: '', description: '' },
  //     prices: prices,
  //     colors: [],
  //     categories: [],
  //     makers: [],
  //     images: [],
  //   };
  // }, [priceTypes, currencies]);

  return (
    <Layout title={document.title}>
      <div className="p-4 md:p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="hidden text-2xl font-bold sm:block">Productos</h1>
          <div className="mt-4 flex w-full items-center space-x-1 sm:mt-0 sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by product name..."
                className="w-full rounded-md border py-2 pr-4 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <h4 className="leading-none font-medium">
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
          <div className="mt-4 flex items-center space-x-2 sm:mt-0 sm:flex">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <Rows className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'tile' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('tile')}
            >
              <Columns className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'post' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('post')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-180px)] w-full">
                <Spinner />
            </div>
        ) : (
          <div
            className={
              viewMode === 'tile'
                ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
                : ''
            }
          >
            {isAdding && productToAdd && (
              <ProductListItem
                ref={newProductFormRef} // Pass ref here
                product={productToAdd}
                isInitiallyEditing={true}
                onSave={handleCreateProduct}
                onCancel={() => setIsAdding(false)}
                allCategories={allCategories}
                allColors={colors}
                setAllColorsInParent={setColors} // Pass parent's setter
                allMakers={allMakers} // Pass parent's state
                setAllMakersInParent={setAllMakers} // Pass parent's setter
                allCurrencies={currencies}
                allProductTypes={productTypes}
                newImageFiles={newImageFiles} // Pass new props
                setNewImageFiles={setNewImageFiles} // Pass new props
                newImagePreviews={newImagePreviews} // Pass new props
                setNewImagePreviews={setNewImagePreviews} // Pass new props
                handleNewImageChange={handleNewImageChange} // Pass new props
                viewMode="list"
                className={isAnimatingNewForm ? 'animate-pulse-once' : ''} // Apply animation class
              />
            )}
            {products.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                viewMode={viewMode}
                onSave={handleUpdateProduct}
                onCancel={() => {}}
                allCategories={allCategories}
                allColors={colors}
                setAllColorsInParent={setColors} // Pass parent's setter
                allMakers={allMakers} // Pass parent's state
                setAllMakersInParent={setAllMakers} // Pass parent's setter
                allCurrencies={currencies}
                allProductTypes={productTypes}
                newImageFiles={newImageFiles} // Pass new props
                setNewImageFiles={setNewImageFiles} // Pass new props
                newImagePreviews={newImagePreviews} // Pass new props
                setNewImagePreviews={setNewImagePreviews} // Pass new props
                handleNewImageChange={handleNewImageChange} // Pass new props
                onSelect={handleProductSelect}
                isSelected={selectedProductIds.includes(product.id as number)}
              />
            ))}
          </div>
        )}
        <FloatingActionButton onClick={() => setIsAdding(true)} />
        {selectedProductIds.length > 0 && (
          <FloatingDeleteButton onClick={handleDeleteSelectedProducts} />
        )}
        <AlertDialog.Root
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
            <AlertDialog.Content className="fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
              <AlertDialog.Title className="text-lg font-semibold">
                ¿Estás seguro?
              </AlertDialog.Title>
              <AlertDialog.Description asChild>
                <div className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer. Esto eliminará (soft delete)
                  los siguientes productos:
                  <ul className="my-2 list-inside list-disc">
                    {selectedProductNames.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              </AlertDialog.Description>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsDeleteModalOpen(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={executeDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </Button>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </Layout>
  );
}
