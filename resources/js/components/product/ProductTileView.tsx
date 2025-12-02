import { Checkbox } from '@/components/ui/checkbox';
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

interface ProductTileViewProps
  extends VariantProps<typeof productListItemVariants> {
  product: Product;
  className?: string;
  onSelect?: (productId: number, isSelected: boolean) => void;
  isSelected?: boolean;
}

export function ProductTileView({
  product,
  className,
  onSelect,
  isSelected,
}: ProductTileViewProps) {
  const { id, name, prices, categories, colors, makers, images, product_type } = product;

  return (
    <div
      className={cn(
        productListItemVariants({ viewMode: 'tile' }),
        className,
        'relative',
      )}
    >
      {id && onSelect && (
        <div className="absolute top-4 left-4 z-10 rounded-full bg-white/70 p-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelect(id as number, checked as boolean)
            }
            className="h-5 w-5"
          />
        </div>
      )}
      <img
        src={images?.[0]?.url || 'https://via.placeholder.com/300'}
        alt={name}
        className="h-48 w-full rounded-t-lg object-cover"
      />
      <div className="flex flex-grow flex-col p-4">
        <h3 className="mb-2 truncate text-lg font-bold" title={name}>
          {name}
        </h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {makers?.map((m) => m.name).join(', ')} - {product_type?.name}
        </p>

        <div className="mb-4 flex flex-wrap gap-1">
          {(categories || []).map((category) => (
            <span
              key={category.id}
              className="flex items-center gap-1 px-2 py-1 rounded-full border text-sm"
            >{category.name}</span>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {(colors || []).map((color) => (
            <span
              key={color.id}
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: color.hex_code }}
              title={color.name}
            ></span>
          ))}
        </div>

        <div className="mt-auto space-y-1">
          {(prices || []).map((price) => (
            <div
              key={price.price_type_id}
              className="flex items-baseline justify-between gap-2"
            >
              <span className="text-sm text-muted-foreground">
                {price.price_type.name}
              </span>
              <div className="flex items-baseline">
                <span className="text-md font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(price.value)}
                </span>
                <span className="pl-1 text-sm text-muted-foreground">
                  {price.currency.symbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
