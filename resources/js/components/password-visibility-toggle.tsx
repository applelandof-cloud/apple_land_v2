import { Eye, EyeOff } from 'lucide-react';

interface PasswordVisibilityToggleProps {
    isVisible: boolean;
    onToggle: () => void;
}

export default function PasswordVisibilityToggle({ isVisible, onToggle }: PasswordVisibilityToggleProps) {
    return (
        <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={onToggle}
        >
            {isVisible ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
        </button>
    );
}
