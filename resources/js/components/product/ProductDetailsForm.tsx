import { DeviceModelForm } from '@/components/DeviceModelForm';
import { EditableField } from '@/components/EditableField';
import { TechAccessoryForm } from '@/components/TechAccessoryForm';
import { Input } from '@/components/ui/input';
import { DeviceModel, Product, ProductType, TechAccessory } from '@/types';

interface ProductDetailsFormProps {
  editedProduct: Product | Partial<Product>;
  setEditedProduct: (product: Product | Partial<Product>) => void;
  allProductTypes: ProductType[];
  apiErrors?: Record<string, string[]>;
}

export function ProductDetailsForm({
  editedProduct,
  setEditedProduct,
  allProductTypes,
  apiErrors,
}: ProductDetailsFormProps) {
  const getError = (field: string) => {
    return apiErrors?.[field]?.[0];
  };

  return (
    <div className="flex flex-col gap-2">
      {' '}
      {/* Added wrapper div with reduced gap */}
      <EditableField
        label={
          <span>
            Nombre del Producto
            {!editedProduct.name && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </span>
        }
        htmlFor="product-name"
        error={getError('name')}
      >
        <Input
          id="product-name"
          value={editedProduct?.name || ''}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, name: e.target.value })
          }
          onFocus={(e) => e.target.select()}
          placeholder="ej. iPhone 15 Pro"
          className="font-bold"
        />
      </EditableField>
      <EditableField
        label="Tipo de Producto"
        htmlFor="product-type"
        error={getError('product_type_id')}
      >
        <select
          id="product-type"
          value={editedProduct?.product_type_id ?? 0}
          onChange={(e) => {
            const newProductTypeId = parseInt(e.target.value);
            let updatedProduct = {
              ...editedProduct,
              product_type_id: newProductTypeId,
            };

            if (newProductTypeId === 1 && !updatedProduct.device_model) {
              updatedProduct = {
                ...updatedProduct,
                device_model: {
                  model_number: '',
                  sku: '',
                  sim: '',
                  storage: '',
                  ram: '',
                },
                tech_accessory: undefined,
              };
            } else if (
              newProductTypeId === 2 &&
              !updatedProduct.tech_accessory
            ) {
              updatedProduct = {
                ...updatedProduct,
                tech_accessory: {
                  model_number: '',
                  size: '',
                  description: '',
                },
                device_model: undefined,
              };
            }
            setEditedProduct(updatedProduct);
          }}
          className="w-full rounded-md border bg-white p-2 text-right font-bold dark:bg-neutral-800"
        >
          {allProductTypes.map((pt) => (
            <option key={pt.id} value={pt.id}>
              {pt.name}
            </option>
          ))}
        </select>
      </EditableField>
      {editedProduct?.product_type_id === 1 && (
        <DeviceModelForm
          deviceModel={
            editedProduct.device_model || {
              model_number: '',
              sku: '',
              sim: '',
              storage: '',
              ram: '',
            }
          }
          onChange={(dm: DeviceModel) =>
            setEditedProduct({ ...editedProduct, device_model: dm })
          }
          apiErrors={apiErrors}
        />
      )}
      {editedProduct?.product_type_id === 2 && (
        <TechAccessoryForm
          techAccessory={
            editedProduct.tech_accessory || {
              model_number: '',
              size: '',
              description: '',
            }
          }
          onChange={(ta: TechAccessory) =>
            setEditedProduct({ ...editedProduct, tech_accessory: ta })
          }
          apiErrors={apiErrors}
        />
      )}
    </div>
  );
}
