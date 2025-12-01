import { EditableField } from '@/components/EditableField';
import { Input } from '@/components/ui/input';
import { Currency, Product } from '@/types';

interface ProductPriceInputsProps {
  editedProduct: Product | Partial<Product>;
  setEditedProduct: (product: Product | Partial<Product>) => void;
  allCurrencies: Currency[];
}

export function ProductPriceInputs({
  editedProduct,
  setEditedProduct,
  allCurrencies,
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
      {(editedProduct.prices || []).map((price) => (
        <EditableField key={price.price_type_id} label={price.price_type.name}>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={price.value}
              onChange={(e) =>
                handlePriceChange(
                  price.price_type_id,
                  e.target.value,
                  price.currency_id,
                )
              }
              className="w-full text-right"
              placeholder="0.00"
            />
            <select
              value={price.currency_id}
              onChange={(e) =>
                handlePriceChange(
                  price.price_type_id,
                  price.value.toString(),
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
      ))}
    </>
  );
}
