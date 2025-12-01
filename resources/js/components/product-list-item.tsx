import { Product } from '@/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const productListItemVariants = cva('transition-all duration-300 ease-in-out', {
    variants: {
        viewMode: {
            list: 'flex flex-col md:flex-row items-start md:items-center p-4 border-b bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800',
            tile: 'flex flex-col rounded-lg border bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg',
            post: 'flex flex-col p-6 border-b bg-white dark:bg-neutral-900',
        },
    },
    defaultVariants: {
        viewMode: 'list',
    },
});

interface ProductListItemProps extends VariantProps<typeof productListItemVariants> {
    product: Product;
    className?: string;
}

export function ProductListItem({ product, viewMode, className }: ProductListItemProps) {
    const { name, image, status, price, price_bs, cost, type, model, maker } = product;

    if (viewMode === 'tile') {
        return (
            <div className={cn(productListItemVariants({ viewMode }), className)}>
                <img src={image} alt={name} className="h-48 w-full rounded-t-lg object-cover" />
                <div className="flex flex-col p-4">
                    <h3 className="text-lg font-bold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{type} - {model}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold">${price}</span>
                            <span className="text-sm text-muted-foreground">Bs {price_bs}</span>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs ${status === 'Disponible' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'post') {
        return (
            <div className={cn(productListItemVariants({ viewMode }), className)}>
                <h2 className="mb-4 text-2xl font-bold">{name}</h2>
                <img src={image} alt={name} className="mb-4 h-64 w-full rounded-lg object-cover" />
                <div className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Precio (USD):</span> ${price}</div>
                    <div><span className="font-semibold">Precio (Bs):</span> Bs {price_bs}</div>
                    <div><span className="font-semibold">Costo:</span> ${cost}</div>
                    <div><span className="font-semibold">Tipo:</span> {type}</div>
                    <div><span className="font-semibold">Modelo:</span> {model}</div>
                    <div><span className="font-semibold">Fabricante:</span> {maker}</div>
                    <div><span className="font-semibold">Estado:</span> {status}</div>
                </div>
            </div>
        );
    }

    // list view is the default
    return (
        <div className={cn(productListItemVariants({ viewMode }), className)}>
            <img src={image} alt={name} className="w-full h-48 md:w-16 md:h-16 rounded-md object-cover mb-4 md:mb-0 md:mr-4" />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                <div className="col-span-2">
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{maker} - {model}</p>
                </div>
                <div>
                    <span className={`rounded-full px-2 py-1 text-xs ${status === 'Disponible' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {status}
                    </span>
                </div>
                <div className="text-left md:text-right">
                    <p className="font-semibold">${price}</p>
                    <p className="text-sm text-muted-foreground">USD</p>
                </div>
                <div className="text-left md:text-right">
                    <p className="font-semibold">Bs {price_bs}</p>
                    <p className="text-sm text-muted-foreground">Bs</p>
                </div>
                <div className="text-left md:text-right">
                    <p className="font-semibold">${cost}</p>
                    <p className="text-sm text-muted-foreground">Costo</p>
                </div>
            </div>
        </div>
    );
}
