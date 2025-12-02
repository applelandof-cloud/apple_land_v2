import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Place, AddInventoryFormData } from '../types';

interface LocationStepProps {
  formData: AddInventoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddInventoryFormData>>;
  places: Place[];
}

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  setFormData,
  places,
}) => {
  return (
    <div>
      <Label htmlFor="place">Ubicación</Label>
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, place_id: value })
        }
        defaultValue={formData.place_id}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar una ubicación" />
        </SelectTrigger>
        <SelectContent>
          {places.map((place) => (
            <SelectItem key={place.id} value={String(place.id)}>
              {place.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
