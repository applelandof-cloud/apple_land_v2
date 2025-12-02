import { EditableField } from '@/components/EditableField';
import { Input } from '@/components/ui/input';
import { Currency, PriceProduct, Product } from '@/types';
import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';

interface ProductPriceInputsProps {
  editedProduct: Product | Partial<Product>;
  setEditedProduct: (product: Product | Partial<Product>) => void;
  allCurrencies: Currency[];
  apiErrors?: Record<string, string[]>; // Add this prop
}

function PriceInput({
  price,
  allCurrencies,
  onPriceChange,
  onCurrencyChange,
  apiErrors = {}, // New prop
  index, // New prop
}: {
  price: PriceProduct;
  allCurrencies: Currency[];
  onPriceChange: (
    priceTypeId: number,
    value: string,
    currencyId: number,
  ) => void;
  onCurrencyChange: (
    priceTypeId: number,
    value: string,
    currencyId: number,
  ) => void;
  apiErrors?: Record<string, string[]>; // New prop
  index: number; // New prop
}) {
  const [inputValue, setInputValue] = useState<string>(price.value.toString());

  useEffect(() => {
    // This effect synchronizes the local input value with the `price.value`
    // prop from the parent. It only runs when `price.value` changes.
    // We compare the parsed local value with the prop to avoid resetting
    // the input while the user is typing (e.g. typing "1." should not
    // be reset to "1").
    if (parseFloat(inputValue) !== price.value) {
      setInputValue(price.value.toString());
    }
    // We only want this to run when the parent prop changes, not when
    // the local `inputValue` changes. Disabling the lint rule is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    onPriceChange(price.price_type_id, inputValue, price.currency_id);
  };

  const getError = (fieldSuffix: string) => {
    const fieldName = `prices.${index}.${fieldSuffix}`;
    return apiErrors?.[fieldName]?.[0];
  };

  const combinedError = [
    getError('value'),
    getError('currency_id'),
    getError('price_type_id'),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <EditableField
      label={price.price_type.name}
      error={combinedError || undefined}
    >
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={(e) => e.target.select()}
          className="w-full text-right"
          placeholder="0.00"
        />
        <select
          value={price.currency_id}
          onChange={(e) =>
            onCurrencyChange(
              price.price_type_id,
              inputValue,
              parseInt(e.target.value),
            )
          }
          className="w-20 rounded-md border bg-white p-2 dark:bg-neutral-800"
        >
          {allCurrencies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.symbol}
            </option>
          ))}
        </select>
      </div>
    </EditableField>
  );
}

export function ProductPriceInputs({
  editedProduct,
  setEditedProduct,
  allCurrencies,
  apiErrors, // New prop
}: ProductPriceInputsProps) {
  const handlePriceChange = (
    priceTypeId: number,
    value: string,
    currencyId: number,
  ) => {
    const currentPrices = editedProduct.prices || [];
    const newPrices = currentPrices.map((p) => {
      if (p.price_type_id === priceTypeId) {
        const foundCurrency = allCurrencies.find((c) => c.id === currencyId);
        return {
          ...p,
          value: parseFloat(value) || 0,
          currency_id: currencyId,
          currency: foundCurrency!,
        };
      }
      return p;
    });
    setEditedProduct({ ...editedProduct, prices: newPrices });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Label className="text-sm font-medium">
            Precios
            {!(
              editedProduct.prices &&
              editedProduct.prices.some((price) => price.value > 0)
            ) && <span className="ml-1 text-red-500">*</span>}
            :
          </Label>
        </div>
        {(editedProduct.prices || []).map(
          (
            price,
            index, // Added index
          ) => (
            <PriceInput
              key={price.price_type_id}
              price={price}
              allCurrencies={allCurrencies}
              onPriceChange={handlePriceChange}
              onCurrencyChange={handlePriceChange}
              apiErrors={apiErrors} // Pass API errors
              index={index} // Pass index
            />
          ),
        )}
      </div>
    </>
  );
}
