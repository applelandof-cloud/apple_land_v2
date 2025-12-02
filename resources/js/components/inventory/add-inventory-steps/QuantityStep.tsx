import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface QuantityStepProps {
  count: string;
  handleCountChange: (countValue: string) => void;
  disabled?: boolean;
}

export const QuantityStep: React.FC<QuantityStepProps> = ({
  count,
  handleCountChange,
  disabled,
}) => {
  return (
    <div>
      <Label htmlFor="count">Cantidad</Label>
      <Input
        id="count"
        type="number"
        value={count}
        onChange={(e) => handleCountChange(e.target.value)}
        className="text-2xl p-4"
        disabled={disabled}
      />
    </div>
  );
};
