import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingDeleteButtonProps {
    onClick: () => void;
    className?: string;
}

export function FloatingDeleteButton({ onClick, className }: FloatingDeleteButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={cn(
                'fixed bottom-8 right-28 h-16 w-16 rounded-full shadow-lg z-[100] bg-red-500 hover:bg-red-600',
                className
            )}
            size="icon"
        >
            <Trash2 className="h-8 w-8" />
        </Button>
    );
}
