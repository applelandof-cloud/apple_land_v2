import { Input } from '@/components/ui/input';
import { DeviceModel } from '@/types';
import { EditableField } from './EditableField'; // Import EditableField

interface DeviceModelFormProps {
    deviceModel: DeviceModel;
    onChange: (deviceModel: DeviceModel) => void;
    apiErrors?: Record<string, string[]>; // Add this prop
}

export function DeviceModelForm({
    deviceModel,
    onChange,
    apiErrors,
}: DeviceModelFormProps) {
    const getError = (field: string) => {
        return apiErrors?.[field]?.[0];
    };

    return (
        <>
            <EditableField
                label={
                    <span>
                        Número de Modelo
                        {!deviceModel?.model_number && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </span>
                }
                htmlFor="device-model-number"
                error={getError('device_model.model_number')}
            >
                <Input
                    id="device-model-number"
                    value={deviceModel?.model_number || ''}
                    onChange={(e) =>
                        onChange({
                            ...deviceModel,
                            model_number: e.target.value,
                        })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. A2403"
                    className="font-bold"
                />
            </EditableField>
            <EditableField
                label="SKU"
                htmlFor="device-sku"
                error={getError('device_model.sku')}
            >
                <Input
                    id="device-sku"
                    value={deviceModel?.sku || ''}
                    onChange={(e) =>
                        onChange({ ...deviceModel, sku: e.target.value })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. MG6A3LL/A"
                    className="font-bold"
                />
            </EditableField>
            <EditableField
                label="SIM"
                htmlFor="device-sim"
                error={getError('device_model.sim')}
            >
                <Input
                    id="device-sim"
                    value={deviceModel?.sim || ''}
                    onChange={(e) =>
                        onChange({ ...deviceModel, sim: e.target.value })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. Doble SIM"
                    className="font-bold"
                />
            </EditableField>
            <EditableField
                label="Almacenamiento"
                htmlFor="device-storage"
                error={getError('device_model.storage')}
            >
                <Input
                    id="device-storage"
                    value={deviceModel?.storage || ''}
                    onChange={(e) =>
                        onChange({ ...deviceModel, storage: e.target.value })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. 128GB"
                    className="font-bold"
                />
            </EditableField>
            <EditableField
                label="RAM"
                htmlFor="device-ram"
                error={getError('device_model.ram')}
            >
                <Input
                    id="device-ram"
                    value={deviceModel?.ram || ''}
                    onChange={(e) =>
                        onChange({ ...deviceModel, ram: e.target.value })
                    }
                    onFocus={(e) => e.target.select()}
                    placeholder="ej. 6GB"
                    className="font-bold"
                />
            </EditableField>
        </>
    );
}
