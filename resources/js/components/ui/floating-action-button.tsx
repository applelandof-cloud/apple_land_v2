import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
    onClick: () => void;
    className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={cn(
                'fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-[100]',
                className
            )}
            size="icon"
        >
            <Plus className="h-8 w-8" />
        </Button>
    );
}