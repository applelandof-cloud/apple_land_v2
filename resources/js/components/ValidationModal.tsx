import * as AlertDialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button'; // Import the Button component

interface ValidationModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

export function ValidationModal({ open, onClose, message }: ValidationModalProps) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onClose}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                    <AlertDialog.Title className="text-lg font-semibold">Error de Validación</AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-muted-foreground">
                        {message}
                    </AlertDialog.Description>
                    <div className="flex justify-end">
                        <Button onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Cerrar</Button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
