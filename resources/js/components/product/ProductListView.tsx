import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { cva, type VariantProps } from 'class-variance-authority';

const productListItemVariants = cva('transition-all duration-300 ease-in-out', {
  variants: {
    viewMode: {
      list: 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800',
      tile: 'flex flex-col rounded-lg border bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg',
      post: 'flex flex-col p-6 border-b bg-white dark:bg-neutral-900',
    },
  },
  defaultVariants: {
    viewMode: 'list',
  },
});

interface ProductListViewProps
  extends VariantProps<typeof productListItemVariants> {
  product: Product;
  className?: string;
  onSelect?: (productId: number, isSelected: boolean) => void;
  isSelected?: boolean;
  onEdit: () => void;
}

export function ProductListView({
  product,
  className,
  onSelect,
  isSelected,
  onEdit,
}: ProductListViewProps) {
  const {
    id,
    name,
    device_model,
    tech_accessory,
    maker, // Changed from makers
    prices,
    categories,
    colors,
    product_type,
  } = product;

  return (
    <div
      className={cn(
        productListItemVariants({ viewMode: 'list' }),
        className,
        'flex flex-col md:flex-row items-start border-b p-4 space-y-4 md:space-y-0 md:space-x-4 relative',
      )}
    >
      {id && onSelect && (
        <div className="absolute top-4 left-4 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelect(id as number, checked as boolean)
            }
            className="h-4 w-4"
          />
        </div>
      )}
      <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 relative">
        <img
          src={product.primary_image_url}
          alt={name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-10 gap-4 flex-grow">
        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {maker?.name ? `${maker.name} ` : ''}
              {maker?.name && product_type?.name ? `- ` : ''}
              {product_type?.name}
            </p>
          </div>
          {product.product_type_id === 1 ? (
            <div className="mt-2 space-y-1 md:max-w-70">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">Modelo:</span>
                <span className="font-bold text-sm text-foreground">{device_model?.model_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">SKU:</span>
                <span className="font-bold text-sm text-foreground">{device_model?.sku}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">SIM:</span>
                <span className="font-bold text-sm text-foreground">{device_model?.sim}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">Almacenamiento:</span>
                <span className="font-bold text-sm text-foreground">{device_model?.storage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">RAM:</span>
                <span className="font-bold text-sm text-foreground">{device_model?.ram}</span>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-1 md:max-w-70">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">Modelo:</span>
                <span className="font-bold text-sm text-foreground">{tech_accessory?.model_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">Tamaño:</span>
                <span className="font-bold text-sm text-foreground">{tech_accessory?.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-normal">Descripción:</span>
                <span className="font-bold text-sm text-foreground">{tech_accessory?.description}</span>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            <Label className="text-sm font-normal text-muted-foreground">Categorias:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {(categories || []).map((category) => (
                <span
                  key={category.id}
                  className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-normal text-muted-foreground mt-3 block">Colores:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {(colors || []).map((color) => (
                <span
                  key={color.id}
                  className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: color.hex_code
                      ? `${color.hex_code}20`
                      : 'transparent',
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full border"
                    style={{ backgroundColor: color.hex_code }}
                  ></span>
                  {color.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col justify-between">
          <Label className="text-sm font-normal text-muted-foreground">Precios:</Label>
          <div className="flex flex-col gap-2 mt-1 md:min-w-50 md:max-w-100">
            {(prices || []).map((price) => (
              <div
                key={price.price_type_id}
                className="flex items-baseline justify-between gap-2"
              >
                <span className="text-sm text-muted-foreground font-normal">
                  {price.price_type.name}:
                </span>
                <div className="flex items-baseline">
                  <span className="text-md text-right font-bold tabular-nums text-foreground">
                    {new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(price.value)}
                  </span>
                  <span className="w-10 pl-1 text-left text-sm font-bold text-foreground">
                    {price.currency.symbol}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-1 flex items-end justify-end">
          <Button variant="outline" onClick={onEdit}>
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
}
