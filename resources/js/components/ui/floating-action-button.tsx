import { Button } from '@/components/ui/button';
import { Plus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react'; // Import React

interface FloatingActionButtonProps {
    onClick: () => void;
    className?: string;
    icon?: LucideIcon; // Add icon prop
}

export function FloatingActionButton({ onClick, className, icon: Icon = Plus }: FloatingActionButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={cn(
                'fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-[100]',
                className
            )}
            size="icon"
        >
            <Icon className="h-8 w-8" />
        </Button>
    );
}