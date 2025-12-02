import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AddInventoryFormData } from '../types';

interface DatesStepProps {
  formData: AddInventoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddInventoryFormData>>;
}

export const DatesStep: React.FC<DatesStepProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="entry_date">Fecha de Entrada</Label>
        <Input
          id="entry_date"
          type="date"
          value={formData.entry_date}
          onChange={(e) =>
            setFormData({ ...formData, entry_date: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="expiration_date">Fecha de Caducidad</Label>
        <Input
          id="expiration_date"
          type="date"
          value={formData.expiration_date}
          onChange={(e) =>
            setFormData({ ...formData, expiration_date: e.target.value })
          }
        />
      </div>
    </div>
  );
};
