import { DeviceModel } from '@/types';
import { Input } from '@/components/ui/input';
import { EditableField } from './EditableField'; // Import EditableField

interface DeviceModelFormProps {
    deviceModel: DeviceModel;
    onChange: (deviceModel: DeviceModel) => void;
}

export function DeviceModelForm({ deviceModel, onChange }: DeviceModelFormProps) {
    return (
        <>
            <EditableField label="Número de Modelo" htmlFor="device-model-number">
                <Input
                    id="device-model-number"
                    value={deviceModel?.model_number || ''}
                    onChange={(e) => onChange({ ...deviceModel, model_number: e.target.value })}
                    placeholder="ej. A2403"
                />
            </EditableField>
            <EditableField label="SKU" htmlFor="device-sku">
                <Input
                    id="device-sku"
                    value={deviceModel?.sku || ''}
                    onChange={(e) => onChange({ ...deviceModel, sku: e.target.value })}
                    placeholder="ej. MG6A3LL/A"
                />
            </EditableField>
            <EditableField label="SIM" htmlFor="device-sim">
                <Input
                    id="device-sim"
                    value={deviceModel?.sim || ''}
                    onChange={(e) => onChange({ ...deviceModel, sim: e.target.value })}
                    placeholder="ej. Doble SIM"
                />
            </EditableField>
            <EditableField label="Almacenamiento" htmlFor="device-storage">
                <Input
                    id="device-storage"
                    value={deviceModel?.storage || ''}
                    onChange={(e) => onChange({ ...deviceModel, storage: e.target.value })}
                    placeholder="ej. 128GB"
                />
            </EditableField>
            <EditableField label="RAM" htmlFor="device-ram">
                <Input
                    id="device-ram"
                    value={deviceModel?.ram || ''}
                    onChange={(e) => onChange({ ...deviceModel, ram: e.target.value })}
                    placeholder="ej. 6GB"
                />
            </EditableField>
        </>
    );
}
