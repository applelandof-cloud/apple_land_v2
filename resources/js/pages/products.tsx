import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductListItem } from '@/components/product-list-item';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { List, Rows, Columns } from 'lucide-react';

type ViewMode = 'list' | 'tile' | 'post';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <Layout>
            <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <div className="flex items-center space-x-2">
                        <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                            <Rows className="h-4 w-4" />
                        </Button>
                        <Button variant={viewMode === 'tile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('tile')}>
                            <Columns className="h-4 w-4" />
                        </Button>
                        <Button variant={viewMode === 'post' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('post')}>
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    <div className={viewMode === 'tile' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : ''}>
                        {products.map((product) => (
                            <ProductListItem key={product.id} product={product} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}