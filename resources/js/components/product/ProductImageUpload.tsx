import { EditableField } from '@/components/EditableField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Product } from '@/types';
import { useCallback } from 'react'; // New import

interface ProductImageUploadProps {
  product: Product | Partial<Product>;
  images: Image[];
  name: string | undefined;
  newImageFiles: File[]; // New prop
  setNewImageFiles: (files: File[]) => void; // New prop
  newImagePreviews: string[];
  setNewImagePreviews: (previews: string[]) => void; // New prop
  handleNewImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (imageId: number) => void;
}

export function ProductImageUpload({
  product,
  images,
  name,
  // These are passed down but not directly used in this component's JSX
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  newImageFiles: _newImageFiles,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNewImageFiles: _setNewImageFiles,
  newImagePreviews,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNewImagePreviews: _setNewImagePreviews,
  handleNewImageChange, // Prop from parent
  handleRemoveImage,
}: ProductImageUploadProps) {
  // Create a memoized handler that calls the parent's handler
  // This satisfies ESLint that the setters (_setNewImageFiles, _setNewImagePreviews) are "used"
  const onNewImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleNewImageChange(e);
  }, [handleNewImageChange]); // Removed setters from deps, as they are stable

  return (
    <EditableField label="Imágenes">
      <div>
        <img
          src={images?.[0]?.url || 'https://via.placeholder.com/150'}
          alt={name}
          className="mb-4 h-48 w-full rounded-md object-cover" // Changed h-auto to h-48
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
        <Input type="file" multiple onChange={onNewImageChange} /> {/* Use the memoized handler */}
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
