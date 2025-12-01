import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export default function Switch({ checked, onCheckedChange, className = '', ...props }: SwitchProps) {
    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    {...props}
                />
                <div className={cn("w-9 h-5 rounded-full transition-colors duration-300 ease-in-out", className)}></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-4 shadow"></div>
            </div>
        </label>
    );
}
