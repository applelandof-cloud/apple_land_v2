import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Stock } from './InventoryListItem';

interface DeleteStockConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stocks: Stock[];
}

export const DeleteStockConfirmationModal: React.FC<
  DeleteStockConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, stocks }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar los siguientes {stocks.length}{' '}
            artículos de stock? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-60 overflow-y-auto my-4">
          <ul className="space-y-2">
            {stocks.map((stock) => (
              <li
                key={stock.id}
                className="text-sm p-2 bg-muted rounded-md truncate"
              >
                {stock.device?.imei ||
                  stock.device?.serial_number ||
                  `Stock ID: ${stock.id}`}
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
