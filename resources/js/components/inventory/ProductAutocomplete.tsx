import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import axios from "axios";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebounce } from "@/hooks/useDebounce"

interface Product {
  id: number;
  name: string;
  product_type_id: number;
  colors: { id: number; name: string }[];
  images: { url: string }[];
}

interface ProductAutocompleteProps {
    onProductSelect: (product: Product | null) => void;
    selectedProduct: Product | null;
}

export function ProductAutocomplete({ onProductSelect, selectedProduct }: ProductAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  React.useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const url = debouncedSearchTerm
      ? `/api/products/search?q=${debouncedSearchTerm}`
      : `/api/products/search`; // Fetch all or default products when no search term

    axios.get(url, { signal: controller.signal })
      .then(res => {
        const data = res.data;
        setProducts(data);
        setLoading(false);
        // If there's no selected product and we just fetched a list,
        // and the search term is empty, automatically select the first one.
        if (!selectedProduct && data.length > 0 && !debouncedSearchTerm) {
          onProductSelect(data[0]);
        }
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch products:", error);
          setLoading(false);
          setProducts([]);
          onProductSelect(null); // Clear selection on error
        }
      });
    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm, onProductSelect, selectedProduct]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProduct && selectedProduct.images ? (
            <div className="flex items-center">
              <img src={selectedProduct.images[0]?.url} alt={selectedProduct.name} className="h-6 w-6 mr-2 object-cover rounded-sm" />
              {selectedProduct.name}
            </div>
          ) : ( selectedProduct?.name || "Select a product" )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search product..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <div className="p-4 text-center text-sm">Loading...</div>
            ) : (
              <>
                <CommandEmpty>No product found.</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={() => {
                        onProductSelect(product)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                        <div className="flex items-center">
                            {product.images && product.images[0] ? <img src={product.images[0].url} alt={product.name} className="h-6 w-6 mr-2 object-cover rounded-sm" /> : <div className="h-6 w-6 mr-2 rounded-sm bg-gray-200" />}
                            {product.name}
                        </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
