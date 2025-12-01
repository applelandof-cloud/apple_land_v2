import { EditableField } from '@/components/EditableField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Product } from '@/types';

interface ProductImageUploadProps {
  product: Product | Partial<Product>;
  images: Image[];
  name: string | undefined;
  newImagePreviews: string[];
  handleNewImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (imageId: number) => void;
}

export function ProductImageUpload({
  product,
  images,
  name,
  newImagePreviews,
  handleNewImageChange,
  handleRemoveImage,
}: ProductImageUploadProps) {
  return (
    <EditableField label="Imágenes">
      <div>
        <img
          src={images?.[0]?.url || 'https://via.placeholder.com/150'}
          alt={name}
          className="mb-4 h-auto w-full rounded-md object-cover"
        />
        {'id' in product && (
          <>
            <div className="mb-2 grid grid-cols-3 gap-2">
              {(images || []).map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt="Product image"
                    className="h-auto w-full rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
        <Input type="file" multiple onChange={handleNewImageChange} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {newImagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`New image ${index + 1}`}
              className="h-16 w-16 rounded-md object-cover"
            />
          ))}
        </div>
      </div>
    </EditableField>
  );
}
