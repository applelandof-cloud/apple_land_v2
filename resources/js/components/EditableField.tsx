import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import React from 'react';

interface EditableFieldProps {
    label: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    htmlFor?: string;
    error?: string; // New prop for error message
}

export function EditableField({ label, children, className, htmlFor, error }: EditableFieldProps) {
    return (
        <div className={cn("flex items-center justify-between gap-2", className)}>
            <Label htmlFor={htmlFor} className="font-normal text-muted-foreground">
                {label}
            </Label>
            <div className="flex-grow">
                {children}
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Display error */}
            </div>
        </div>
    );
}
