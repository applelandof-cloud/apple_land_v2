import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Seller() {
    return (
        <AppLayout>
            <Head title="Seller" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Seller Page</h1>
                <p>Hello Seller!</p>
            </div>
        </AppLayout>
    );
}