import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import React from 'react';

interface EditableFieldProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    htmlFor?: string;
}

export function EditableField({ label, children, className, htmlFor }: EditableFieldProps) {
    return (
        <div className={cn("flex items-center justify-between gap-2", className)}>
            <Label htmlFor={htmlFor}>
                {label}
            </Label>
            <div>
                {children}
            </div>
        </div>
    );
}
