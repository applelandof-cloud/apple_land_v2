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
    images,
    product_type,
  } = product;

  return (
    <div
      className={cn(
        productListItemVariants({ viewMode: 'list' }),
        className,
        'flex flex-col items-start border-b p-4 md:flex-row',
      )}
    >
      <div className="mr-4 flex items-center">
        {id && onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelect(id as number, checked as boolean)
            }
            className="mr-2 h-4 w-4"
          />
        )}
        <img
          src={images?.[0]?.url || 'https://via.placeholder.com/150'}
          alt={name}
          className="mb-4 h-auto w-full rounded-md object-cover md:mr-4 md:mb-0 md:h-32 md:w-32"
        />
      </div>
      <div className="grid w-full grid-cols-1 items-start gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {maker?.name ? `${maker.name} (${maker.origin}) - ` : ''}{product_type?.name}
          </p>
          {product.product_type_id === 1 ? (
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Modelo:</span>
                <span>{device_model?.model_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SKU:</span>
                <span>{device_model?.sku}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SIM:</span>
                <span>{device_model?.sim}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Almacenamiento:</span>
                <span>{device_model?.storage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RAM:</span>
                <span>{device_model?.ram}</span>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Modelo:</span>
                <span>{tech_accessory?.model_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tamaño:</span>
                <span>{tech_accessory?.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Descripción:</span>
                <span>{tech_accessory?.description}</span>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <Label>Categorias:</Label>
          <div className="flex flex-wrap gap-1">
            {(categories || []).map((category) => (
              <span
                key={category.id}
                className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>
          <br />
          <Label>Colores:</Label>
          <div className="flex flex-wrap gap-1">
            {(colors || []).map((color) => (
              <span
                key={color.id}
                className="flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
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

        <div className="md:col-span-4">
          {(prices || []).map((price) => (
            <div
              key={price.price_type_id}
              className="flex items-baseline justify-between gap-2"
            >
              <span className="text-sm text-muted-foreground">
                {price.price_type.name}
              </span>
              <div className="flex items-baseline">
                <span className="text-md text-right font-semibold tabular-nums">
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(price.value)}
                </span>
                <span className="w-10 pl-1 text-left text-sm text-muted-foreground">
                  {price.currency.symbol}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end md:col-span-2 md:flex-col">
          <Button variant="outline" onClick={onEdit}>
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
}
