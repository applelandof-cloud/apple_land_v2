import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TechAccessory } from '@/types';
import { EditableField } from './EditableField'; // Import EditableField

interface TechAccessoryFormProps {
    techAccessory: TechAccessory;
    onChange: (techAccessory: TechAccessory) => void;
    apiErrors?: Record<string, string[]>; // Add this prop
}

export function TechAccessoryForm({
    techAccessory,
    onChange,
    apiErrors,
}: TechAccessoryFormProps) {
    const getError = (field: string) => {
        return apiErrors?.[field]?.[0];
    };

    return (
        <>
            <EditableField
                label="Número de Modelo"
                htmlFor="tech-accessory-model-number"
                error={getError('tech_accessory.model_number')}
            >
                <Input
                    id="tech-accessory-model-number"
                    value={techAccessory?.model_number || ''}
                    onChange={(e) =>
                        onChange({
                            ...techAccessory,
                            model_number: e.target.value,
                        })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. A2403"
                    className="font-bold"
                />
            </EditableField>
            <EditableField
                label="Tamaño"
                htmlFor="tech-accessory-size"
                error={getError('tech_accessory.size')}
            >
                <Input
                    id="tech-accessory-size"
                    value={techAccessory?.size || ''}
                    onChange={(e) =>
                        onChange({ ...techAccessory, size: e.target.value })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. Grande"
                    className="font-bold"
                />
            </EditableField>
            <EditableField
                label="Descripción"
                htmlFor="tech-accessory-description"
                error={getError('tech_accessory.description')}
            >
                <Textarea
                    id="tech-accessory-description"
                    value={techAccessory?.description || ''}
                    onChange={(e) =>
                        onChange({
                            ...techAccessory,
                            description: e.target.value,
                        })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. Funda protectora de alta calidad"
                    className="font-bold"
                />
            </EditableField>
        </>
    );
}
