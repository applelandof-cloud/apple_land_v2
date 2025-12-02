import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Item {
    id: string | number;
    name: string;
    hex_code?: string;
}

interface MultiSelectDropdownProps {
    items: Item[];
    selectedIds: string[];
    onSelectionChange: (id: string) => void;
    placeholder: string;
}

export function MultiSelectDropdown({
    items,
    selectedIds,
    onSelectionChange,
    placeholder,
}: MultiSelectDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start font-normal"
                >
                    {placeholder}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {items.map((item) => (
                    <DropdownMenuCheckboxItem
                        key={item.id}
                        checked={selectedIds.includes(item.id.toString())}
                        onCheckedChange={() =>
                            onSelectionChange(item.id.toString())
                        }
                        className="flex items-center"
                    >
                        {item.hex_code && (
                            <span
                                className="mr-2 h-4 w-4 rounded-full border"
                                style={{
                                    backgroundColor: item.hex_code,
                                }}
                            ></span>
                        )}
                        {item.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
