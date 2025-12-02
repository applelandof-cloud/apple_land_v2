import { TechAccessory } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditableField } from './EditableField'; // Import EditableField

interface TechAccessoryFormProps {
    techAccessory: TechAccessory;
    onChange: (techAccessory: TechAccessory) => void;
}

export function TechAccessoryForm({ techAccessory, onChange }: TechAccessoryFormProps) {
    return (
        <>
            <EditableField label="Número de Modelo" htmlFor="tech-accessory-model-number">
                <Input
                    id="tech-accessory-model-number"
                    value={techAccessory?.model_number || ''}
                    onChange={(e) => onChange({ ...techAccessory, model_number: e.target.value })}
                    placeholder="ej. A2403"
                />
            </EditableField>
            <EditableField label="Tamaño" htmlFor="tech-accessory-size">
                <Input
                    id="tech-accessory-size"
                    value={techAccessory?.size || ''}
                    onChange={(e) => onChange({ ...techAccessory, size: e.target.value })}
                    placeholder="ej. Grande"
                />
            </EditableField>
            <EditableField label="Descripción" htmlFor="tech-accessory-description">
                <Textarea
                    id="tech-accessory-description"
                    value={techAccessory?.description || ''}
                    onChange={(e) => onChange({ ...techAccessory, description: e.target.value })}
                    placeholder="ej. Funda protectora de alta calidad"
                />
            </EditableField>
        </>
    );
}
